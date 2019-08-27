const assert = require('assert');
const nock = require('nock');
const proxyquire = require('proxyquire');
const Authenticator = require('../../../lib/auth/Authenticator');

let authenticator;
let xssecStub;

const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gU0FQIiwiaWF0IjoxNTE2MjM5MDIyfQ.vrRldgjFOYWVhsOQEoM-lHDpPc_g6rZ6ecsTRM6H8MA';
const exchangedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlNBUCBUZXN0IiwiaWF0IjoxNTE2MjM5MDIyfQ.eS_ilFJWy8PB_2Y4xq8AKqm1eLBUQqAoO4tgfQwD2k4';

describe('Authenticator', () => {
    beforeEach(() => {
        xssecStub = {};
        const ProxyquireAuthenticator = proxyquire('../../../lib/auth/Authenticator', {'@sap/xssec': xssecStub});
        authenticator = new ProxyquireAuthenticator({
            url: 'https://test.authentication.eu10.hana.ondemand.com',
            clientid: 'clientId',
            clientsecret: 'clientSecret'
        }, {});

        authenticator._xsuaaService = {credentials: {}};
        authenticator._credentials = {};
    });

    describe('constructor', () => {
        it('throws error if no credentials are provided', async () => {
            assert.throws(() => new Authenticator(), Error, 'Expected Error was not thrown');
        });
    });

    describe('getAccessToken', () => {
        it('should return a token', async () => {
            nock('https://test.authentication.eu10.hana.ondemand.com')
                .post('/oauth/token')
                .reply(200, {
                    access_token: sampleToken,
                    expires_in: 1000,
                });

            const token = await authenticator.getAccessToken();
            assert.equal(token, sampleToken);
        });

        it('should only return a new token if the stored token is expired', async () => {
            nock('https://test.authentication.eu10.hana.ondemand.com')
                .post('/oauth/token')
                .reply(200, {
                    access_token: sampleToken,
                    expires_in: -1000,
                });

            const token = await authenticator.getAccessToken();
            assert.equal(token, sampleToken);
        });
    });

    describe('getNewToken', () => {
        it('should return a new token', async () => {
            nock('https://test.authentication.eu10.hana.ondemand.com')
                .post('/oauth/token')
                .reply(function (uri, requestBody) {
                    assert.equal(this.req.headers['content-type'], 'application/x-www-form-urlencoded');
                    assert.equal(this.req.headers.authorization, 'Basic Y2xpZW50SWQ6Y2xpZW50U2VjcmV0');
                    assert.equal(requestBody, 'grant_type=client_credentials&response_type=token');
                    return [200, {
                        access_token: sampleToken,
                        expires_in: -1000,
                    }];
                });

            const token = await authenticator.getNewToken();
            assert.equal(token.getAccessToken(), sampleToken);
        });

        it('should return an error', async () => {
            nock('https://test.authentication.eu10.hana.ondemand.com')
                .post('/oauth/token')
                .replyWithError('UAA Error');

            try {
                await authenticator.getNewToken();
                assert.fail();
            } catch (error) {
                assert.equal(error.message, 'Error: UAA Error');
            }
        });
    });

    describe('exchangeToken', () => {
        it('expect error for missing xsuaa configuration', async () => {
            authenticator._credentials = {};
            delete authenticator._xsuaaService;

            try {
                await authenticator.exchangeToken();
                assert.fail('Should not have been resolved');
            } catch (err) {
                assert.equal(err.message, 'XSUAA (Source of token) service binding missing', 'Should has rejeceted with error');
            }
        });

        it('expect error for missing leonardo iot credentials configuration', async () => {
            delete authenticator._credentials;
            authenticator._xsuaaService = {credentials: {}};

            try {
                await authenticator.exchangeToken();
                assert.fail('Should not have been resolved');
            } catch (err) {
                assert.equal(err.message, 'Leonardo IoT service binding missing', 'Should has rejeceted with error');
            }
        });

        it('security context creation fails', async () => {
            xssecStub.createSecurityContext = (accessToken, credentials, callback) => {
                callback(new Error('SecurityContext error'), null);
            };

            try {
                await authenticator.exchangeToken();
                assert.fail('Should not have been resolved');
            } catch (err) {
                assert.equal(err.message, 'SecurityContext error', 'Should has rejeceted with error');
            }
        });

        it('exchange token request fails', async () => {
            xssecStub.createSecurityContext = (accessToken, credentials, callback) => {
                callback(null, {
                    getGrantType: () => { return 'client_credentials' },
                    requestToken: (serviceCredentials, type, additionalAttributes, callback) => {
                        callback(new Error('RequestToken error'), null);
                    }
                });
            };

            try {
                await authenticator.exchangeToken();
                assert.fail('Should not have been resolved');
            } catch (err) {
                assert.equal(err.message, 'RequestToken error', 'Should has rejeceted with error');
            }
        });

        it('successful exchange', async () => {
            xssecStub.createSecurityContext = (accessToken, credentials, callback) => {
                callback(null, {
                    getGrantType: () => { return 'client_credentials' },
                    requestToken: (serviceCredentials, type, additionalAttributes, callback) => {
                        callback(null, exchangedToken);
                    }
                });
            };

            const token = await authenticator.exchangeToken();
            assert.equal(token, exchangedToken);
        });
    });
});
