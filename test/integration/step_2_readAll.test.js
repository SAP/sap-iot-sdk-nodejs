const assert = require('assert');
const LeonardoIoT = require('../../lib/LeonardoIoT');
const DataHelper = require('./helper/DataHelper');

describe('Read All Entities', function () {
  let client;

  before(function () {
    client = new LeonardoIoT();
  });

  it('should read all packages', async function () {
    const response = await client.getPackages();
    assert(response.d.results.length > 0);
  });

  it('should read all property set types', async function () {
    const response = await client.getPropertySetTypes();
    assert(response.d.results.length > 0);
  });

  it('should read all property set types by package', async function () {
    const response = await client.getPropertySetTypesByPackage(DataHelper.package().Name);
    assert(response.d.results.length > 0);
    assert(response.d.results[0].PackageName, DataHelper.package().Name);
  });

  it('should read all thing types', async function () {
    const response = await client.getThingTypes();
    assert(response.d.results.length > 0);
  });

  it('should read all thing types by package', async function () {
    const response = await client.getThingTypesByPackage(DataHelper.package().Name);
    assert(response.d.results.length > 0);
    assert.strictEqual(response.d.results[0].PackageName, DataHelper.package().Name);
  });

  it('should read all object groups', async function () {
    const response = await client.getObjectGroups();
    assert(response.value.length > 0);
  });

  it('should read all object groups filtered by name', async function () {
    const objectGroups = await client.getObjectGroups({ $filter: `name eq ${DataHelper.objectGroup().name}` });
    [DataHelper.data.objectGroup] = objectGroups.value;
    assert.strictEqual(objectGroups.value[0].name, DataHelper.data.objectGroup.name);
  });

  it('should read all things', async function () {
    const things = await client.getThings();
    assert(things.value.length > 0);
  });

  it('should read all things filtered by name', async function () {
    const things = await client.getThingsByThingType(DataHelper.thingType().Name, { $filter: '_name ne \'xyz\'' });
    assert(things.value.length > 0);
    assert.strictEqual(things.value[0]._name, DataHelper.thing()._name);
  });

  it('should read all things by thingtype', async function () {
    const things = await client.getThingsByThingType(DataHelper.thingType().Name);
    [DataHelper.data.thing] = things.value;
    assert(things.value.length > 0);
    assert.strictEqual(things.value[0]._name, DataHelper.thing()._name);
  });
});
