const assert = require('assert');
const Navigator = require('../../../lib/utils/Navigator');
const ConfigurationProvider = require('../../../lib/utils/ConfigurationProvider');

describe('Navigator', function () {
    describe('Destinations', function () {
        let navigator;

        beforeEach(function () {
            navigator = new Navigator(ConfigurationProvider.getDestinations());
        });

        it('valid constructor call', function () {
            navigator = new Navigator({
                'appiot-mds': 'https://appiot-mds.cfapps.eu10.hana.ondemand.com'
            });
            assert(navigator.appiotMds());
        });

        it('invalid constructor call', function () {
            try {
                navigator = new Navigator();
                assert.fail('Expected Error was not thrown');
            } catch (err) {
                assert.equal(err.message, 'Incomplete navigator configuration. Ensure a SAP IoT service instance binding or configure authentication options including endpoints via default-env.json file as described in the readme section of used SAP Leonardo IoT SDK', 'Unexpected error message');
            }
        });

        it('all functioned destinations are existing in sample env', function () {
            assert(navigator.authorization());
            assert(navigator.businessPartner());
            assert(navigator.configPackage());
            assert(navigator.configThing());
            assert(navigator.appiotMds());
            assert(navigator.tmDataMapping());
            assert(navigator.appiotColdstore());
        });

        it('getDestination for known destination', function () {
            assert.equal(navigator.getDestination('appiot-mds'), 'https://appiot-mds.cfapps.eu10.hana.ondemand.com', 'Unexpected destination');
        });

        it('getDestination for unknown destination', function () {
            assert.throws(() => navigator.getDestination('unknown'), Error, 'Expected Error was not thrown');
        });
    });
});
