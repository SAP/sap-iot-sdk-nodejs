const AssertionUtil = require('../AssertionUtil');
const LeonardoIoT = require('../../../lib/LeonardoIoT');

const appiotMdsUrl = 'https://appiot-mds.cfapps.eu10.hana.ondemand.com';

describe('Time Series Store', function () {
  let client;
  let currentTime;

  beforeEach(function () {
    client = new LeonardoIoT();
    currentTime = new Date().toISOString();
  });

  describe('Time Series Data', function () {
    it('should read thing snapshot', function () {
      const thingId = 'MyThing';
      const dataCategory = 'TimeSeries';

      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Snapshot(thingId='${thingId}',fromTime='',dataCategory='${dataCategory}')`,
        });
      };

      return client.getThingSnapshot(thingId, dataCategory);
    });

    it('should read thing snapshot with default data category', function () {
      const thingId = 'MyThing';

      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/Snapshot(thingId='${thingId}',fromTime='',dataCategory='')`,
        });
      };

      return client.getThingSnapshot(thingId);
    });

    it('should read thing snapshot within time range', function () {
      const thingId = 'MyThing';
      const fromTime = currentTime;
      const toTime = new Date().toISOString();
      const dataCategory = 'TimeSeries';

      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/v2/Snapshot(thingId='${thingId}',fromTime='${fromTime}',toTime='${toTime}',dataCategory='${dataCategory}')`,
        });
      };

      return client.getThingSnapshotWithinTimeRange(thingId, fromTime, toTime, dataCategory);
    });

    it('should read thing snapshot within time range with default data category', function () {
      const thingId = 'MyThing';
      const fromTime = currentTime;
      const toTime = new Date().toISOString();

      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${appiotMdsUrl}/v2/Snapshot(thingId='${thingId}',fromTime='${fromTime}',toTime='${toTime}',dataCategory='')`,
        });
      };

      return client.getThingSnapshotWithinTimeRange(thingId, fromTime, toTime);
    });

    it('should recalculate aggregates', function () {
      const thingId = 'MyThing';
      const thingTypeName = 'MyThingType';
      const propertySetName = 'MyPropertySet';
      const fromTime = currentTime;
      const toTime = new Date().toISOString();

      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          method: 'POST',
          url: `${appiotMdsUrl}/Things('${thingId}')/${thingTypeName}/${propertySetName}/RecalculateAggregate`,
          qs: { timerange: `${fromTime}-${toTime}` },
        });
      };

      return client.recalculateAggregates(thingId, thingTypeName, propertySetName, fromTime, toTime);
    });
  });
});
