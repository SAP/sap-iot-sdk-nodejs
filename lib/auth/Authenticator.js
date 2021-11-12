const debug = require('debug')('SAPIoT:Authenticator');
const rp = require('request-promise-native');
const xssec = require('@sap/xssec');
const Token = require('./Token');

/**
 * Authenticating the client at the API of SAP IoT
 *
 * @class Authenticator
 * @author Lukas Brinkmann, Jan Reichert, Soeren Buehler
 */
class Authenticator {
  /**
   * Create a new Authenticator.
   *
   * @param {object} credentials - SAP IoT service UAA information
   * @param {object} xsuaaService - XSUAA service object
   */
  constructor(credentials, xsuaaService) {
    debug('Creating a new authenticator');
    if (credentials && credentials.url && credentials.clientid && credentials.clientsecret) {
      this.clientId = credentials.clientid;
      this.clientSecret = credentials.clientsecret;
      this.authUrl = `${credentials.url}/oauth/token`;
    } else {
      // eslint-disable-next-line max-len
      throw Error('Incomplete authentication configuration. Ensure a SAP IoT service instance binding or configure authentication options via default-env.json file as described in the readme section of used SAP IoT SDK');
    }

    this._credentials = credentials;
    this._xsuaaService = xsuaaService;
  }

  /**
   * Retrieves a JWT Token to authenticate at the API of SAP IoT.
   * If the client has authenticated before and the JWT token is not expired, no
   * new JWT Token is requested.
   *
   * @param {string[]} scopes - Scopes to request for the token
   * @returns {string} The JWT Token.
   */
  async getToken(scopes = []) {
    debug('Authenticating');
    if (this._checkNewTokenRequired(scopes)) {
      this.token = await this.getNewToken(scopes);
    }

    return this.token;
  }

  _checkNewTokenRequired(scopes = []) {
    // no token given
    if (!this.token) {
      return true;
    }

    // token expired
    if (this.token.isExpired()) {
      return true;
    }

    if (scopes.length > 0) {
      const tokenScopes = this.token.getScopes();

      // token scopes not matching
      if (tokenScopes.length !== scopes.length) {
        return true;
      }

      const requiredScopeMissing = scopes.some((scope) => !tokenScopes.includes(scope));
      if (requiredScopeMissing) return true;
    }
    return false;
  }

  /**
   * Retrieves a new JWT token to authenticate at the API of SAP IoT
   *
   * @param {string[]} [scopes] - List of scopes which are mandatory for the token
   * @throws {Error} Will throw if request fails
   * @returns {Token} The JWT Token
   */
  async getNewToken(scopes) {
    debug('Getting a new token.');
    const credentialsBase64 = Buffer
      .from(`${this.clientId}:${this.clientSecret}`)
      .toString('base64');

    const form = {
      grant_type: 'client_credentials',
      response_type: 'token',
    };

    if (scopes && scopes.length > 0) {
      form.scope = scopes.join(' ');
    }

    let responseBody;
    try {
      responseBody = await rp({
        url: this.authUrl,
        method: 'POST',
        form,
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
   * Exchange token exposed by own XSUAA instance with service token for SAP IoT.
   *
   * @param {string} accessToken - JWT token exposed by UAA instance of SDK user
   * @returns {Promise.<*>} Result of the token exchange operation
   */
  exchangeToken(accessToken) {
    const that = this;
    // eslint-disable-next-line consistent-return
    return new Promise((resolve, reject) => {
      if (!that._xsuaaService || !that._xsuaaService.credentials) {
        reject(new Error('XSUAA (Source of token) service binding missing'));
        return;
      }
      if (!that._credentials) {
        reject(new Error('SAP IoT service binding missing'));
        return;
      }

      // eslint-disable-next-line consistent-return
      xssec.createSecurityContext(accessToken, that._xsuaaService.credentials, (error, securityContext) => {
        if (error) {
          debug(`Token exchange error: ${error}`);
          return reject(error);
        }

        debug('Security context created successfully');
        let grantType = xssec.constants.TYPE_USER_TOKEN;
        if (securityContext.getGrantType() === 'client_credentials') {
          grantType = xssec.constants.TYPE_CLIENT_CREDENTIALS_TOKEN;
        }

        securityContext.requestToken(that._credentials, grantType, {}, (err, newToken) => {
          if (err) {
            debug(`Token exchange error: ${err}`);
            return reject(err);
          }

          debug('Token successfully exchanged');
          return resolve(newToken);
        });
      });
    });
  }
}

module.exports = Authenticator;
