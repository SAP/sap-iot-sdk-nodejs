const assert = require('assert');
const Navigator = require('../../../lib/utils/Navigator');
const ConfigurationProvider = require('../../../lib/utils/ConfigurationProvider');

describe('Navigator', () => {
    describe('Destinations', () => {
        let navigator;

        beforeEach(() => {
            navigator = new Navigator(ConfigurationProvider.getDestinations());
        });

        it('valid constructor call', async () => {
            navigator = new Navigator({
                "appiot-mds": "https://appiot-mds.cfapps.eu10.hana.ondemand.com"
            });
            assert(navigator.appiotMds());
        });

        it('invalid constructor call', async () => {
            try {
                navigator = new Navigator();
                assert.fail('Expected Error was not thrown');
            } catch (err) {
                assert.equal(err.message, 'Incomplete navigator configuration. Ensure a Leonardo IoT service instance binding or configure authentication options including endpoints via default-env.json file as described in the readme section of used SAP Leonardo IoT SDK', 'Unexpected error message');
            }
        });

        it('all functioned destinations are existing in sample env', async () => {
            assert(navigator.authorization());
            assert(navigator.businessPartner());
            assert(navigator.configPackage());
            assert(navigator.configThing());
            assert(navigator.appiotMds());
            assert(navigator.tmDataMapping());
            assert(navigator.appiotColdstore());
        });

        it('getDestination for known destination', async () => {
            assert.equal(navigator.getDestination('appiot-mds'), 'https://appiot-mds.cfapps.eu10.hana.ondemand.com', 'Unexpected destination');
        });

        it('getDestination for unknown destination', async () => {
            assert.throws(() => navigator.getDestination('unknown'), Error, 'Expected Error was not thrown');
        });
    });
});
