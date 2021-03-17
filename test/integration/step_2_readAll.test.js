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
    await client.getPropertySetTypes();
    return client.getPropertySetTypesByPackage(DataHelper.package().Name);
  });

  it('thing types', async function () {
    await client.getThingTypes();
    return client.getThingTypesByPackage(DataHelper.package().Name);
  });

  it('object groups', async function () {
    await client.getObjectGroups();
    const objectGroups = await client.getObjectGroups({ $filter: `name eq ${DataHelper.objectGroup().name}` });
    [DataHelper.data.objectGroup] = objectGroups.value;
  });

  it('things', async function () {
    await client.getThings();
    await client.getThingsByThingType(DataHelper.thingType().Name, { $filter: '_name ne \'xyz\'' });
    const things = await client.getThingsByThingType(DataHelper.thingType().Name);
    [DataHelper.data.thing] = things.value;
  });

  it('events', async function () {
    await client.getEvents();
    await client.getEventsByThingId(DataHelper.data.thing._id, { $filter: '_status ne \'InProcess\'' });
    const events = await client.getEventsByThingId(DataHelper.data.thing._id);
    [DataHelper.data.event] = events.value;
  });
});
