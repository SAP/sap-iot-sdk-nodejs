const assert = require('assert');
const Navigator = require('../../../lib/utils/Navigator');
const ConfigurationProvider = require('../../../lib/utils/ConfigurationProvider');

describe('Navigator', function () {
  describe('Destinations', function () {
    let navigator;

    beforeEach(function () {
      navigator = new Navigator(ConfigurationProvider.getDestinations());
    });

    it('should call constructor successfully', function () {
      navigator = new Navigator({
        'appiot-mds': 'https://appiot-mds.cfapps.eu10.hana.ondemand.com',
      });
      assert(navigator.appiotMds());
    });

    it('should throw error for invalid constructor call', function () {
      try {
        navigator = new Navigator();
        assert.fail('Expected Error was not thrown');
      } catch (err) {
        assert.strictEqual(
          err.message,
          // eslint-disable-next-line max-len
          'Incomplete navigator configuration. Ensure a SAP IoT service instance binding or configure authentication options including endpoints via default-env.json file as described in the readme section of used SAP IoT SDK',
          'Unexpected error message',
        );
      }
    });

    it('all functional destinations should exist in sample env', function () {
      assert(navigator.authorization());
      assert(navigator.businessPartner());
      assert(navigator.configPackage());
      assert(navigator.configThing());
      assert(navigator.appiotMds());
      assert(navigator.tmDataMapping());
      assert(navigator.appiotColdstore());
    });

    it('should get destination for known destination', function () {
      assert.strictEqual(navigator.getDestination('appiot-mds'), 'https://appiot-mds.cfapps.eu10.hana.ondemand.com', 'Unexpected destination');
    });

    it('should throw error for unknwon destination', function () {
      assert.throws(() => navigator.getDestination('unknown'), Error, 'Expected Error was not thrown');
    });
  });
});
