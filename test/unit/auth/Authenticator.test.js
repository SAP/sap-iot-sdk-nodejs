const assert = require('assert');
const jwt = require('jwt-simple');
const nock = require('nock');
const proxyquire = require('proxyquire');
const Authenticator = require('../../../lib/auth/Authenticator');
const Token = require('../../../lib/auth/Token');

let authenticator;
let xssecStub;

const tokenSecret = 'test';
const sampleToken = { name: 'SAP IoT Token', scope: ['rule.r', 'rule.c', 'rule.d'] };
const exchangedToken = { name: 'Exchange Token', scope: ['rule.r', 'rule.c', 'rule.d'] };

describe('Authenticator', function () {
  beforeEach(function () {
    xssecStub = {};
    const ProxyquireAuthenticator = proxyquire('../../../lib/auth/Authenticator', { '@sap/xssec': xssecStub });
    authenticator = new ProxyquireAuthenticator({
      url: 'https://test.authentication.eu10.hana.ondemand.com',
      clientid: 'clientId',
      clientsecret: 'clientSecret',
    }, {});

    authenticator._xsuaaService = { credentials: {} };
    authenticator._credentials = {};
  });

  describe('constructor', function () {
    it('throws error if no credentials are provided', function () {
      assert.throws(() => new Authenticator(), Error, 'Expected Error was not thrown');
    });
  });

  describe('getToken', function () {
    it('should return a token', async function () {
      nock('https://test.authentication.eu10.hana.ondemand.com')
        .post('/oauth/token')
        .reply(200, {
          access_token: jwt.encode(sampleToken, tokenSecret),
          expires_in: 1000,
        });
      let token;
      try {
        token = await authenticator.getToken();
      } catch (error) {
        assert.fail(error);
      }
      const expectedToken = jwt.encode(sampleToken, tokenSecret);
      assert.equal(token.getAccessToken(), expectedToken);
    });

    it('should return a token with specific scopes', async function () {
      const scopes = ['thing.r', 'thing.c'];
      const scopeToken = JSON.parse(JSON.stringify(sampleToken));
      scopeToken.scope = scopes;

      nock('https://test.authentication.eu10.hana.ondemand.com')
        .post('/oauth/token')
        .reply(200, {
          access_token: jwt.encode(scopeToken, tokenSecret),
          expires_in: 1000,
        });
      let token;
      try {
        token = await authenticator.getToken(scopes);
      } catch (error) {
        assert.fail(error);
      }

      const expectedToken = jwt.encode(scopeToken, tokenSecret);
      assert.equal(token.getAccessToken(), expectedToken);
    });

    it('should only return a new token if the stored token is expired', async function () {
      nock('https://test.authentication.eu10.hana.ondemand.com')
        .post('/oauth/token')
        .reply(200, {
          access_token: jwt.encode(sampleToken, tokenSecret),
          expires_in: -1000,
        });
      let token;
      try {
        token = await authenticator.getToken();
      } catch (error) {
        assert.fail(error);
      }
      const expectedToken = jwt.encode(sampleToken, tokenSecret);
      assert.equal(token.getAccessToken(), expectedToken);
    });
  });

  describe('checkNewTokenRequired', function () {
    beforeEach(function () {
      authenticator = new Authenticator({
        url: 'https://test.authentication.eu10.hana.ondemand.com',
        clientid: 'clientId',
        clientsecret: 'clientSecret',
      }, {});
    });

    it('no existing token is given', async function () {
      assert(authenticator._checkNewTokenRequired());
    });

    it('existing token expired', async function () {
      authenticator.token = new Token(jwt.encode(sampleToken, tokenSecret), -1);
      assert(authenticator._checkNewTokenRequired());
    });

    it('unmatching number of required scopes', async function () {
      authenticator.token = new Token(jwt.encode(sampleToken, tokenSecret), 900);
      const requiredScopes = sampleToken.scope;
      requiredScopes.push('thing.r');
      assert(authenticator._checkNewTokenRequired(requiredScopes));
    });

    it('unmatching required scopes', async function () {
      authenticator.token = new Token(jwt.encode(sampleToken, tokenSecret), 900);
      const requiredScopes = ['thing.r', 'thing.c', 'thing.d'];
      assert(authenticator._checkNewTokenRequired(requiredScopes));
    });

    it('existing valid token without scope definition', async function () {
      authenticator.token = new Token(jwt.encode(sampleToken, tokenSecret), 900);
      assert(!authenticator._checkNewTokenRequired());
    });

    it('valid existing token matching scopes', async function () {
      authenticator.token = new Token(jwt.encode(sampleToken, tokenSecret), 900);
      assert(!authenticator._checkNewTokenRequired(sampleToken.scope));
    });
  });

  describe('getNewToken', function () {
    it('should return a new token', async function () {
      nock('https://test.authentication.eu10.hana.ondemand.com')
        .post('/oauth/token')
        // eslint-disable-next-line func-names
        .reply(function (uri, requestBody) {
          assert.equal(this.req.headers['content-type'], 'application/x-www-form-urlencoded');
          assert.equal(this.req.headers.authorization, 'Basic Y2xpZW50SWQ6Y2xpZW50U2VjcmV0');
          assert.equal(requestBody, 'grant_type=client_credentials&response_type=token');
          return [200, {
            access_token: jwt.encode(sampleToken, tokenSecret),
            expires_in: -1000,
          }];
        });
      let token;
      try {
        token = await authenticator.getNewToken();
      } catch (error) {
        assert.fail(error);
      }
      const expectedToken = jwt.encode(sampleToken, tokenSecret);
      assert.equal(token.getAccessToken(), expectedToken);
    });

    it('should return a new token with specific scopes', async function () {
      const scopes = ['thing.r', 'thing.c'];
      const scopeToken = JSON.parse(JSON.stringify(sampleToken));
      scopeToken.scope = scopes;

      nock('https://test.authentication.eu10.hana.ondemand.com')
        .post('/oauth/token')
        // eslint-disable-next-line func-names
        .reply(function (uri, requestBody) {
          assert.equal(this.req.headers['content-type'], 'application/x-www-form-urlencoded');
          assert.equal(this.req.headers.authorization, 'Basic Y2xpZW50SWQ6Y2xpZW50U2VjcmV0');
          assert.equal(requestBody, 'grant_type=client_credentials&response_type=token&scope=thing.r%20thing.c');
          return [200, {
            access_token: jwt.encode(scopeToken, tokenSecret),
            expires_in: -1000,
          }];
        });
      let token;
      try {
        token = await authenticator.getNewToken(scopes);
      } catch (error) {
        assert.fail(error);
      }
      const expectedToken = jwt.encode(scopeToken, tokenSecret);
      assert.equal(token.getAccessToken(), expectedToken);
    });

    it('should return an error', async function () {
      nock('https://test.authentication.eu10.hana.ondemand.com')
        .post('/oauth/token')
        .replyWithError('UAA Error');

      try {
        await authenticator.getNewToken();
        assert.fail('Should not have been resolved');
      } catch (error) {
        assert.equal(error.message, 'Error: UAA Error');
      }
    });
  });

  describe('exchangeToken', function () {
    it('expect error for missing xsuaa configuration', async function () {
      authenticator._credentials = {};
      delete authenticator._xsuaaService;

      try {
        await authenticator.exchangeToken();
        assert.fail('Should not have been resolved');
      } catch (err) {
        assert.equal(err.message, 'XSUAA (Source of token) service binding missing', 'Should has rejeceted with error');
      }
    });

    it('expect error for missing SAP IoT credentials configuration', async function () {
      delete authenticator._credentials;
      authenticator._xsuaaService = { credentials: {} };

      try {
        await authenticator.exchangeToken();
        assert.fail('Should not have been resolved');
      } catch (err) {
        assert.equal(err.message, 'SAP IoT service binding missing', 'Should has rejeceted with error');
      }
    });

    it('security context creation fails', async function () {
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

    it('exchange token request fails', async function () {
      xssecStub.createSecurityContext = (accessToken, credentials, callback) => {
        callback(null, {
          getGrantType: () => 'client_credentials',
          requestToken: (serviceCredentials, type, additionalAttributes, cb) => {
            cb(new Error('RequestToken error'), null);
          },
        });
      };

      try {
        await authenticator.exchangeToken();
        assert.fail('Should not have been resolved');
      } catch (err) {
        assert.equal(err.message, 'RequestToken error', 'Should has rejeceted with error');
      }
    });

    it('successful exchange', async function () {
      xssecStub.createSecurityContext = (accessToken, credentials, callback) => {
        callback(null, {
          getGrantType: () => 'client_credentials',
          requestToken: (serviceCredentials, type, additionalAttributes, cb) => {
            cb(null, exchangedToken);
          },
        });
      };

      const token = await authenticator.exchangeToken();
      assert.equal(token, exchangedToken);
    });
  });
});
