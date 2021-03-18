const assert = require('assert');
const LeonardoIoT = require('../../lib/LeonardoIoT');
const DataHelper = require('./helper/DataHelper');

describe('5) DATA', function () {
  let client;
  let thingTypeName;
  let propertySetName;
  let thingId;

  let currentTime;
  let oneYearAgoTime;

  before(function () {
    client = new LeonardoIoT();
    currentTime = new Date().toISOString();
    oneYearAgoTime = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString();
  });

  describe('Timeseries Store & Timeseries Aggregate Store', function () {
    before(function () {
      thingTypeName = DataHelper.thingType().Name;
      propertySetName = DataHelper.thingType().PropertySets[0].Name;
      thingId = DataHelper.data.thing._id;
    });

    it('should create a timeseries data entity', function () {
      return client.createTimeSeriesData(thingId, thingTypeName, propertySetName, {
        value: [{
          _time: currentTime,
          Temperature: 25,
        }],
      });
    });

    it('should read timeseries data', async function () {
      const response = await client.getTimeSeriesData(thingId, thingTypeName, propertySetName);
      assert(response.value.length > 0);
    });

    it('should read snapshot', async function () {
      const response = await client.getThingSnapshot(thingId);
      assert.strictEqual(response._id, thingId);
    });

    it('should read snapshot within time range', async function () {
      const fromTime = currentTime;
      const toTime = new Date().toISOString();
      const response = await client.getThingSnapshotWithinTimeRange(thingId, fromTime, toTime);
      assert.strictEqual(response._id, thingId);
    });

    it('should recalculate aggregates', function () {
      const fromTime = currentTime;
      const toTime = new Date().toISOString();
      return client.recalculateAggregates(thingId, thingTypeName, propertySetName, fromTime, toTime);
    });

    it('should delete timeseries data', function () {
      return client.deleteTimeSeriesData(thingId, thingTypeName, propertySetName, currentTime, currentTime);
    });
  });

  describe('Timeseries Cold Store', function () {
    before(function () {
      thingTypeName = DataHelper.thingType().Name;
      propertySetName = DataHelper.thingType().PropertySets[0].Name;
      thingId = DataHelper.data.thing._id;
    });

    it('should create a timeseries coldstore data entity', function () {
      return client.createColdStoreTimeSeriesData(thingId, thingTypeName, propertySetName, {
        value: [{
          _time: oneYearAgoTime,
          Temperature: 28,
        }],
      });
    });

    it('should read timeseries coldstore data', function () {
      return client.getColdStoreTimeSeriesData(thingId, thingTypeName, propertySetName, oneYearAgoTime, oneYearAgoTime);
    });

    it('should delete timeseries coldstore data', function () {
      return client.deleteColdStoreTimeSeriesData(thingId, thingTypeName, propertySetName, oneYearAgoTime, oneYearAgoTime);
    });
  });
});
