const AssertionUtil = require('../AssertionUtil');
const LeonardoIoT = require('../../../lib/LeonardoIoT');

const appiotMdsUrl = 'https://appiot-mds.cfapps.eu10.hana.ondemand.com';

describe('Thing Service', function () {
  let client;

  beforeEach(function () {
    client = new LeonardoIoT();
  });

  describe('Thing', function () {
    it('create', function () {
      const thingPayload = { Name: 'MyThing' };
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Things`,
          method: 'POST',
          body: thingPayload,
        });
      };

      return client.createThing(thingPayload);
    });

    it('read single', function () {
      const thingId = 'MyThing';
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Things('${thingId}')`,
        });
      };

      return client.getThing(thingId);
    });

    it('read single by alternate identifier', function () {
      const thingAlternateId = 'MyAlternateThing';
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/ThingsByAlternateId('${thingAlternateId}')`,
        });
      };

      return client.getThingByAlternateId(thingAlternateId);
    });

    it('read multiple', function () {
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Things`,
        });
      };

      return client.getThings();
    });

    it('read multiple with different query parameters', function () {
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Things?$select=_id,_name&$orderby=_id&$top=10&$skip=5`,
        });
      };

      return client.getThings({
        $select: '_id,_name', $orderby: '_id', $top: 10, $skip: 5,
      });
    });

    it('read multiple by thing type', function () {
      const thingTypeName = 'MyThingType';
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Things?$filter=_thingType eq '${thingTypeName}'`,
        });
      };

      return client.getThingsByThingType(thingTypeName);
    });

    it('read multiple by thing type with complex filter', function () {
      const thingTypeName = 'MyThingType';
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Things?$filter=_name eq 'test' and _thingType eq '${thingTypeName}'`,
        });
      };

      return client.getThingsByThingType(thingTypeName, { $filter: '_name eq \'test\'' });
    });

    it('delete', function () {
      const thingId = 'MyThing';
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Things('${thingId}')`,
          method: 'DELETE',
        });
      };

      return client.deleteThing(thingId);
    });
  });
});
