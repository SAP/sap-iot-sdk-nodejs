const assert = require('assert');
const jwt = require('jwt-simple');
const proxyquire = require('proxyquire');
const Token = require('../../lib/auth/Token');

let rpStub = () => Promise.reject();
const LeonardoIoT = proxyquire('../../lib/LeonardoIoT', { 'request-promise-native': (requestConfig) => rpStub(requestConfig) });
const AssertionUtil = require('./AssertionUtil');
const packageJson = require('../../package.json');

const tokenSecret = 'test';
const generatedAccessToken = {
  zid: 'ade586c6-f5b1-4ddc-aecb-ead3c2e6e725', scope: ['uaa.user'], name: 'SAP IoT Test 1', iat: 1516239022,
};
const forwardedAccessToken = {
  zid: 'ade586c6-f5b1-4ddc-aecb-ead3c2e6e725', scope: ['uaa.user'], name: 'SAP IoT Test 2', iat: 1516239022,
};

describe('LeonardoIoT', function () {
  let client;
  let tmpVcapServices;

  beforeEach(function () {
    client = new LeonardoIoT();
    tmpVcapServices = JSON.parse(JSON.stringify(process.env.VCAP_SERVICES));
  });

  afterEach(function () {
    process.env.VCAP_SERVICES = JSON.parse(JSON.stringify(tmpVcapServices));
  });

  describe('constructor', function () {
    it('should create a new sdk instance without arguments', function () {
      const clientDefault = new LeonardoIoT();
      assert.notStrictEqual(clientDefault, undefined, 'Invalid constructor for LeonardoIoT client');
    });

    it('should create a new sdk instance with configuration arguments', function () {
      const testClient = new LeonardoIoT({
        uaa: {
          clientid: 'testId',
          clientsecret: 'testSecret',
          url: 'https://test.authentication.eu10.hana.ondemand.com',
        },
        endpoints: {
          'appiot-mds': 'https://appiot-mds.cfapps.eu10.hana.ondemand.com',
          'config-thing-sap': 'https://config-thing-sap.cfapps.eu10.hana.ondemand.com',
        },
      });
      assert.notStrictEqual(testClient, undefined, 'Invalid constructor for LeonardoIoT client');
    });

    it('should create a new sdk instance with configuration arguments including xsuaa config', function () {
      const testClient = new LeonardoIoT({
        uaa: {
          clientid: 'testId',
          clientsecret: 'testSecret',
          url: 'https://test.authentication.eu10.hana.ondemand.com',
        },
        endpoints: {
          'appiot-mds': 'https://appiot-mds.cfapps.eu10.hana.ondemand.com',
          'config-thing-sap': 'https://config-thing-sap.cfapps.eu10.hana.ondemand.com',
        },
      });
      assert.notStrictEqual(testClient, undefined, 'Invalid constructor for LeonardoIoT client');
    });

    it('should create multiple sdk instances for multi tenant mode', function () {
      const clientTest = new LeonardoIoT('sap-iot-account-test');
      const clientDev = new LeonardoIoT('sap-iot-account-dev');

      assert.notStrictEqual(clientTest.authenticator.authUrl, clientDev.authenticator.authUrl, 'Mismatching client ID of clients');
      assert.notStrictEqual(clientTest.authenticator.clientId, clientDev.authenticator.clientId, 'Mismatching client ID of clients');
      assert.notStrictEqual(clientTest.authenticator.clientSecret, clientDev.authenticator.clientSecret, 'Mismatching client ID of clients');
    });
  });

  describe('Request', function () {
    it('should have default parameters', function () {
      const token = jwt.encode(forwardedAccessToken, tokenSecret);
      const testHeaders = LeonardoIoT._addUserAgent({});
      testHeaders.Authorization = `Bearer ${token}`;
      rpStub = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: 'https://appiot-mds.cfapps.eu10.hana.ondemand.com/Things',
          method: 'GET',
          headers: testHeaders,
          body: {},
          qs: {},
          agentOptions: {},
          resolveWithFullResponse: false,
        });
      };
      client.authenticator.exchangeToken = async function () {
        return token;
      };

      return client.request({
        url: 'https://appiot-mds.cfapps.eu10.hana.ondemand.com/Things',
        jwt: token,
      });
    });

    it('should have correct version in user agent header field', function () {
      const headers = LeonardoIoT._addUserAgent({});
      assert.strictEqual(headers['User-Agent'], `${packageJson.name}-nodejs / ${packageJson.version}`, 'Unexpected User-Agent header field value');
    });

    it('should throw error for missing URL parameter', async function () {
      try {
        await LeonardoIoT._request({ url: null });
        assert.fail('Expected Error was not thrown');
      } catch (err) {
        assert.strictEqual(err.message, 'URL argument is empty for "request" call in SAP IoT', 'Unexpected error message');
      }
    });
  });

  describe('JWT token', function () {
    it('should get forwarded correctly', function () {
      const token = jwt.encode(forwardedAccessToken, tokenSecret);
      rpStub = (requestConfig) => {
        const expectedJwt = `Bearer ${token}`;
        assert.strictEqual(requestConfig.headers.Authorization, expectedJwt, 'Unexpected JWT token forwarding');
      };
      client.authenticator.exchangeToken = async function () {
        return token;
      };

      return client.request({
        url: 'https://appiot-mds.cfapps.eu10.hana.ondemand.com/Things',
        jwt: token,
      });
    });

    it('should get sliced and forwarded correctly', function () {
      const token = jwt.encode(forwardedAccessToken, tokenSecret);
      rpStub = (requestConfig) => {
        const expectedJwt = `Bearer ${token}`;
        assert.strictEqual(requestConfig.headers.Authorization, expectedJwt, 'Unexpected JWT token forwarding');
      };
      client.authenticator.exchangeToken = async function () {
        return token;
      };

      return client.request({
        url: 'https://appiot-mds.cfapps.eu10.hana.ondemand.com/Things',
        jwt: `bearer ${token}`,
      });
    });

    it('should get fetched from authentication URL for request', function () {
      const token = jwt.encode(generatedAccessToken, tokenSecret);
      rpStub = (requestConfig) => {
        const expectedJwt = `Bearer ${token}`;
        assert.strictEqual(requestConfig.headers.Authorization, expectedJwt, 'Unexpected JWT token forwarding');
      };
      client.authenticator.getToken = async function () {
        return new Token(token, 900);
      };

      return client.request({
        url: 'https://appiot-mds.cfapps.eu10.hana.ondemand.com/Things',
      });
    });
  });
});
