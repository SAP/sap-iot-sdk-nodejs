const assert = require('assert');
const proxyquire = require('proxyquire');
const ConfigurationProvider = require('../../../lib/utils/ConfigurationProvider');

describe('ConfigurationProvider', function () {
  let tmpVcapServices;

  describe('Authentication', function () {
    beforeEach(function () {
      tmpVcapServices = JSON.parse(JSON.stringify(process.env.VCAP_SERVICES));
    });

    afterEach(function () {
      process.env.VCAP_SERVICES = JSON.parse(JSON.stringify(tmpVcapServices));
    });

    it('getCredentials from service broker service', function () {
      // eslint-disable-next-line max-len
      process.env.VCAP_SERVICES = '{"iotae":[{"name":"internal","credentials":{"uaa":{"url":"ServiceBrokerUaaUrl","clientid":"ServiceBrokerClientId","clientsecret":"ServiceBrokerClientSecret"}},"tags":["leonardoiot"]}]}';

      const authentication = ConfigurationProvider.getCredentials();
      assert.strictEqual(authentication.url, 'ServiceBrokerUaaUrl', 'Unexpected UAA url');
      assert.strictEqual(authentication.clientid, 'ServiceBrokerClientId', 'Unexpected Client ID');
      assert.strictEqual(authentication.clientsecret, 'ServiceBrokerClientSecret', 'Unexpected Client secret');
    });

    it('getCredentials without any settings', function () {
      process.env.VCAP_SERVICES = '{}';
      const authentication = ConfigurationProvider.getCredentials();
      assert(authentication === undefined, 'Unexpected return value');
    });
  });

  describe('Destination', function () {
    beforeEach(function () {
      tmpVcapServices = JSON.parse(JSON.stringify(process.env.VCAP_SERVICES));
      process.env.VCAP_SERVICES = '{}';
    });

    afterEach(function () {
      process.env.VCAP_SERVICES = JSON.parse(JSON.stringify(tmpVcapServices));
    });

    it('getDestinations from environment', function () {
      // eslint-disable-next-line max-len
      process.env.VCAP_SERVICES = '{"iotae":[{"credentials":{"endpoints":{"appiot-mds":"https://appiot-mds-backup.cfapps.de01.hana.ondemand.com"}},"tags":["leonardoiot"]}]}';

      const destinations = ConfigurationProvider.getDestinations();
      assert.strictEqual(destinations['appiot-mds'], 'https://appiot-mds-backup.cfapps.de01.hana.ondemand.com', 'Unexpected destination');
    });

    it('getDestinations without any settings', function () {
      process.env.VCAP_SERVICES = '{}';
      const authentication = ConfigurationProvider.getDestinations();
      assert(authentication === undefined, 'Unexpected return value');
    });
  });

  describe('getService filter', function () {
    beforeEach(function () {
      tmpVcapServices = JSON.parse(JSON.stringify(process.env.VCAP_SERVICES));
    });

    afterEach(function () {
      process.env.VCAP_SERVICES = JSON.parse(JSON.stringify(tmpVcapServices));
    });

    it('get existing leonardo iot service by tag', function () {
      const service = ConfigurationProvider._getService({ tag: 'leonardoiot' });
      assert.strictEqual(service.tags[0], 'leonardoiot', 'Unexpected service');
    });

    it('get existing xsuaa service by tag', function () {
      const service = ConfigurationProvider._getService({ tag: 'xsuaa' });
      assert.strictEqual(service.tags[0], 'xsuaa', 'Unexpected service');
    });

    it('get not existing service by tag', function () {
      const service = ConfigurationProvider._getService({ tag: 'notExisting' });
      assert.strictEqual(service, undefined, 'Unexpected service');
    });

    it('get existing service by name', function () {
      const service = ConfigurationProvider._getService({ name: 'iot_internal' });
      assert.strictEqual(service.name, 'iot_internal', 'Unexpected service');
    });

    it('get existing user provided service by name', function () {
      const service = ConfigurationProvider._getService({ name: 'leonardo-iot-account-test' });
      assert.strictEqual(service.name, 'leonardo-iot-account-test', 'Unexpected service');
    });

    it('get not existing service by name', function () {
      const service = ConfigurationProvider._getService({ name: 'notExisting' });
      assert.strictEqual(service, undefined, 'Unexpected service');
    });

    it('expect error for missing environment configuration', function () {
      const xsenvStub = { loadEnv: () => { } };
      const ProxyquireConfigurationProvider = proxyquire('../../../lib/utils/ConfigurationProvider', { '@sap/xsenv': xsenvStub });

      delete process.env.VCAP_SERVICES;
      assert.throws(() => ProxyquireConfigurationProvider._getService(), Error, 'Expected Error was not thrown');
    });
  });
});
