const AssertionUtil = require('../AssertionUtil');
const LeonardoIoT = require('../../../lib/LeonardoIoT');

const appiotMdsUrl = 'https://appiot-mds.cfapps.eu10.hana.ondemand.com';

describe('Time Series Store', function () {
  let client;

  beforeEach(function () {
    client = new LeonardoIoT();
  });

  describe('Time Series Data', function () {
    it('create', function () {
      const thingId = 'MyThing';
      const thingTypeName = 'MyThingType';
      const propertySetId = 'MyPropertySet';
      const timeSeriesPayload = { value: [{ Temperature: '25', _time: new Date().toISOString() }] };

      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Things('${thingId}')/${thingTypeName}/${propertySetId}`,
          method: 'PUT',
          body: timeSeriesPayload,
        });
      };
      return client.createTimeSeriesData(thingId, thingTypeName, propertySetId, timeSeriesPayload);
    });

    it('read', function () {
      const thingId = 'MyThing';
      const thingTypeName = 'MyThingType';
      const propertySetId = 'MyPropertySet';
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Things('${thingId}')/${thingTypeName}/${propertySetId}`,
        });
      };

      return client.getTimeSeriesData(thingId, thingTypeName, propertySetId);
    });

    it('delete', function () {
      const thingId = 'MyThing';
      const thingTypeName = 'MyThingType';
      const propertySetId = 'MyPropertySet';
      const fromTime = '2019-06-15T08:00:00Z';
      const toTime = '2019-06-15T20:00:00Z';
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Things('${thingId}')/${thingTypeName}/${propertySetId}?timerange=${fromTime}-${toTime}`,
          method: 'DELETE',
        });
      };

      return client.deleteTimeSeriesData(thingId, thingTypeName, propertySetId, fromTime, toTime);
    });
  });
});
