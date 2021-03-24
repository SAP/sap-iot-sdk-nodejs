const AssertionUtil = require('../AssertionUtil');
const LeonardoIoT = require('../../../lib/LeonardoIoT');

const appiotMdsUrl = 'https://appiot-mds.cfapps.eu10.hana.ondemand.com';

describe('Time Series Store', function () {
  let client;
  let queryParameters;
  let queryKey;
  let queryValue;

  before(function () {
    queryParameters = {};
    queryKey = '$expand';
    queryValue = 'Descriptions';
    queryParameters[queryKey] = queryValue;
  });

  beforeEach(function () {
    client = new LeonardoIoT();
  });

  describe('Time Series Data', function () {
    it('should create timeseries data', function () {
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

    it('should read timeseries data', function () {
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

    it('should read timeseries data with query parameters', function () {
      const thingId = 'MyThing';
      const thingTypeName = 'MyThingType';
      const propertySetId = 'MyPropertySet';
      const queryParatemeters = {};
      queryParatemeters[queryKey] = queryValue;
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Things('${thingId}')/${thingTypeName}/${propertySetId}`,
          qs: queryParatemeters,
        });
      };

      return client.getTimeSeriesData(thingId, thingTypeName, propertySetId, queryParameters);
    });

    it('should delete timeseries data', function () {
      const thingId = 'MyThing';
      const thingTypeName = 'MyThingType';
      const propertySetId = 'MyPropertySet';
      const fromTime = '2019-06-15T08:00:00Z';
      const toTime = '2019-06-15T20:00:00Z';
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Things('${thingId}')/${thingTypeName}/${propertySetId}`,
          qs: { timerange: `${fromTime}-${toTime}` },
          method: 'DELETE',
        });
      };

      return client.deleteTimeSeriesData(thingId, thingTypeName, propertySetId, fromTime, toTime);
    });
  });
});
