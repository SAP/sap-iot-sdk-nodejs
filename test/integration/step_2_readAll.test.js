const assert = require('assert');
const LeonardoIoT = require('../../lib/LeonardoIoT');
const DataHelper = require('./helper/DataHelper');

describe('2) READ ALL', function () {
  let client;

  before(function () {
    client = new LeonardoIoT();
  });

  it('packages', function () {
    return client.getPackages();
  });

  it('property set types', async function () {
    try {
      await client.getPropertySetTypes();
    } catch (error) {
      assert.fail(error);
    }
    return client.getPropertySetTypesByPackage(DataHelper.package().Name);
  });

  it('thing types', async function () {
    try {
      await client.getThingTypes();
    } catch (error) {
      assert.fail(error);
    }
    return client.getThingTypesByPackage(DataHelper.package().Name);
  });

  it('object groups', async function () {
    try {
      await client.getObjectGroups();
      const objectGroups = await client.getObjectGroups({ $filter: `name eq ${DataHelper.objectGroup().name}` });
      [DataHelper.data.objectGroup] = objectGroups.value;
    } catch (error) {
      assert.fail(error);
    }
  });

  it('things', async function () {
    try {
      await client.getThings();
      await client.getThingsByThingType(DataHelper.thingType().Name, { $filter: '_name ne \'xyz\'' });
      const things = await client.getThingsByThingType(DataHelper.thingType().Name);
      [DataHelper.data.thing] = things.value;
    } catch (error) {
      assert.fail(error);
    }
  });

  it('events', async function () {
    try {
      await client.getEvents();
      await client.getEventsByThingId(DataHelper.data.thing._id, { $filter: '_status ne \'InProcess\'' });
      const events = await client.getEventsByThingId(DataHelper.data.thing._id);
      [DataHelper.data.event] = events.value;
    } catch (error) {
      assert.fail(error);
    }
  });
});
