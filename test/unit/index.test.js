const assert = require('assert');
const LeonardoIoT = require('../..');

describe('SDK Default Export', function () {
  it('call with configuration arguments', function () {
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
    assert.notEqual(testClient, undefined, 'Invalid constructor for LeonardoIoT client');
  });
});
