const assert = require('assert');
const LeonardoIoT = require('../../lib/LeonardoIoT');
const DataHelper = require('./helper/DataHelper');

describe('2) READ ALL', function () {
  let client;

  before(function () {
    client = new LeonardoIoT();
  });

  it('packages', async function () {
    const response = await client.getPackages();
    assert(response.d.results.length > 0);
  });

  it('property set types', async function () {
    const response = await client.getPropertySetTypes();
    assert(response.d.results.length > 0);
  });

  it('property set types by package', async function () {
    const response = await client.getPropertySetTypesByPackage(DataHelper.package().Name);
    assert(response.d.results.length > 0);
    assert(response.d.results[0].PackageName, DataHelper.package().Name);
  });

  it('thing types', async function () {
    const response = await client.getThingTypes();
    assert(response.d.results.length > 0);
  });

  it('thing types by package', async function () {
    const response = await client.getThingTypesByPackage(DataHelper.package().Name);
    assert(response.d.results.length > 0);
    assert.strictEqual(response.d.results[0].PackageName, DataHelper.package().Name);
  });

  it('object groups', async function () {
    const response = await client.getObjectGroups();
    assert(response.value.length > 0);
  });

  it('filter object groups', async function () {
    const objectGroups = await client.getObjectGroups({ $filter: `name eq ${DataHelper.objectGroup().name}` });
    [DataHelper.data.objectGroup] = objectGroups.value;
    assert.strictEqual(objectGroups.value[0].name, DataHelper.data.objectGroup.name);
  });

  it('things', async function () {
    const things = await client.getThings();
    assert(things.value.length > 0);
  });

  it('filter things', async function () {
    const things = await client.getThingsByThingType(DataHelper.thingType().Name, { $filter: '_name ne \'xyz\'' });
    assert(things.value.length > 0);
    assert.strictEqual(things.value[0]._name, DataHelper.data.thing._name);
  });

  it('things by thingtype', async function () {
    const things = await client.getThingsByThingType(DataHelper.thingType().Name);
    [DataHelper.data.thing] = things.value;
    assert(things.value.length > 0);
    assert.strictEqual(things.value[0]._name, DataHelper.data.thing._name);
  });

  it('events', async function () {
    const events = await client.getEvents();
    assert(events.value.length > 0);
  });

  it('filter events', async function () {
    const events = await client.getEventsByThingId(DataHelper.data.thing._id, { $filter: '_status ne \'InProcess\'' });
    assert(events.value.length > 0);
    assert.strictEqual(events.value[0]._thingId, DataHelper.data.thing._id);
  });

  it('events by thing id', async function () {
    const events = await client.getEventsByThingId(DataHelper.data.thing._id);
    [DataHelper.data.event] = events.value;
    assert(events.value.length > 0);
    assert.strictEqual(events.value[0]._thingId, DataHelper.data.thing._id);
  });
});
