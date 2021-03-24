const AssertionUtil = require('../AssertionUtil');
const LeonardoIoT = require('../../../lib/LeonardoIoT');

const appiotMdsUrl = 'https://appiot-mds.cfapps.eu10.hana.ondemand.com';

describe('Thing Service', function () {
  let client;

  beforeEach(function () {
    client = new LeonardoIoT();
  });

  describe('Thing', function () {
    it('should create thing', function () {
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

    it('should read single thing', function () {
      const thingId = 'MyThing';
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Things('${thingId}')`,
        });
      };

      return client.getThing(thingId);
    });

    it('should read single thing by alternate identifier', function () {
      const thingAlternateId = 'MyAlternateThing';
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/ThingsByAlternateId('${thingAlternateId}')`,
        });
      };

      return client.getThingByAlternateId(thingAlternateId);
    });

    it('should read multiple things', function () {
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Things`,
        });
      };

      return client.getThings();
    });

    it('should read multiple things with different query parameters', function () {
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Things`,
          qs: {
            $select: '_id,_name', $orderby: '_id', $top: 10, $skip: 5,
          },
        });
      };

      return client.getThings({
        $select: '_id,_name', $orderby: '_id', $top: 10, $skip: 5,
      });
    });

    it('should read multiple things by thing type', function () {
      const thingTypeName = 'MyThingType';
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Things`,
          qs: { $filter: `_thingType eq '${thingTypeName}'` },
        });
      };

      return client.getThingsByThingType(thingTypeName);
    });

    it('should read multiple things by thing type with complex filter', function () {
      const thingTypeName = 'MyThingType';
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Things`,
          qs: { $filter: `_name eq 'test' and _thingType eq '${thingTypeName}'` },
        });
      };

      return client.getThingsByThingType(thingTypeName, { $filter: '_name eq \'test\'' });
    });

    it('should delete thing by id', function () {
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
