const debug = require('debug')('LeonardoIoT:Authenticator');
const rp = require('request-promise-native');
const xssec = require('@sap/xssec');
const Token = require('./Token');

/**
 *  @class Authenticator
 *  @author: Lukas Brinkmann, Jan Reichert, Soeren Buehler
 *  Authenticating the client at the API of SAP IoT
 */
class Authenticator {
    /**
     * Create a new Authenticator.
     * @constructor
     * @param {Object} credentials - SAP IoT service UAA information
     * @param {Object} xsuaaService - XSUAA service object
     */
    constructor(credentials, xsuaaService) {
        debug('Creating a new authenticator');
        if (credentials && credentials.url && credentials.clientid && credentials.clientsecret) {
            this.clientId = credentials.clientid;
            this.clientSecret = credentials.clientsecret;
            this.authUrl = `${credentials.url}/oauth/token`;
        } else {
            throw Error('Incomplete authentication configuration. Ensure a Leonardo IoT service instance binding or configure authentication ' +
                'options via default-env.json file as described in the readme section of used SAP Leonardo IoT SDK');
        }

        this._credentials = credentials;
        this._xsuaaService = xsuaaService;
    }

    /**
     * Retrieves a JWT Token to authenticate at the API of SAP IoT.
     * If the client has authenticated before and the JWT token is not expired, no
     * new JWT Token is requested.
     * @return {String} JWT token
     */
    async getAccessToken() {
        debug('Authenticating');

        // if we don´t have a token or the stored token is expired, get a new one
        if (!this.token || this.token.isExpired()) {
            this.token = await this.getNewToken();
        }

        return this.token.getAccessToken();
    }

    /**
     * Retrieves a new JWT token to authenticate at the API of SAP IoT
     * @return {Token} The JWT Token.
     */
    async getNewToken() {
        debug('Getting a new token.');
        const credentialsBase64 = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

        let responseBody;
        try {
            responseBody = await rp({
                url: this.authUrl,
                method: 'POST',
                form: {
                    grant_type: 'client_credentials',
                    response_type: 'token',
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${credentialsBase64}`,
                },
                json: true,
            });
        } catch (error) {
            debug(error.message);
            throw error;
        }

        debug('Authentification was successful');
        return new Token(responseBody.access_token, responseBody.expires_in);
    }

    /**
     * Exchange token exposed by own XSUAA instance with service token for SAP Leonardo IoT.
     * @param {String} accessToken - JWT token provided by UAA instance of SDK user
     * @returns {Promise.<*>}
     */
    async exchangeToken(accessToken) {
        this._validateExchangeTokenPrerequisites();
        const securityContext = await this._createSecurityContext(accessToken, this._xsuaaService.credentials);
        return this._requestToken(securityContext, this._credentials);
    }

    /**
     * Validation if foreign xsuaa credentials and SAP IoT UAA credentials are available for token exchange
     */
    _validateExchangeTokenPrerequisites() {
        if (!this._xsuaaService || !this._xsuaaService.credentials) {
            throw new Error('XSUAA (Source of token) service binding missing');
        }
        if (!this._credentials) {
            throw new Error('Leonardo IoT service binding missing');
        }
    }

    /**
     * Creating security context using xssec library
     *
     * @param {*} accessToken - JWT token
     * @param {*} xsuaaCredentials - Foreign xsuaa credentials for token exchange
     */
    _createSecurityContext(accessToken, xsuaaCredentials) {
        return new Promise((resolve, reject) => {
            xssec.createSecurityContext(accessToken, xsuaaCredentials, (error, securityContext) => {
                if (error) {
                    debug(`Security Context creation error: ${error}`);
                    return reject(error);
                }

                debug('Security context created successfully');
                return resolve(securityContext);
            });
        });
    }

    /**
     * Request new token for existing token
     *
     * @param {*} securityContext - xssec security context
     * @param {*} credentials - SAP IoT xsuaa credentials
     */
    _requestToken(securityContext, credentials) {
        return new Promise((resolve, reject) => {
            let grantType = xssec.constants.TYPE_USER_TOKEN;
            if (securityContext.getGrantType() === 'client_credentials') {
                grantType = xssec.constants.TYPE_CLIENT_CREDENTIALS_TOKEN;
            }

            securityContext.requestToken(credentials, grantType, {}, (err, newToken) => {
                if (err) {
                    debug(`Token exchange error: ${err}`);
                    return reject(err);
                }

                debug('Token successfully exchanged');
                return resolve(newToken);
            });
        });
    }
}

module.exports = Authenticator;
