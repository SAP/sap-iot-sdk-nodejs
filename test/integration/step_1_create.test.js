const assert = require('assert');
const LeonardoIoT = require('../../lib/LeonardoIoT');
const DataHelper = require('./helper/DataHelper');

describe('1) CREATE', function () {
  let client;

  before(function () {
    client = new LeonardoIoT();
  });

  it('package', async function () {
    const response = await client.createPackage(DataHelper.package());
    assert.strictEqual(response.d.Status, 'Active');
  });

  it('property set type', async function () {
    const response = await client.createPropertySetType(DataHelper.package().Name, DataHelper.propertySetType());
    assert.strictEqual(response.d.Name, DataHelper.propertySetType().Name);
  });

  it('thing type', async function () {
    const response = await client.createThingType(DataHelper.package().Name, DataHelper.thingType());
    assert.strictEqual(response.d.Name, DataHelper.thingType().Name);
  });

  it('object group', function () {
    return client.createObjectGroup(DataHelper.objectGroup());
  });

  it('thing', function () {
    return client.createThing(DataHelper.thing());
  });

  it('event', async function () {
    const things = await client.getThingsByThingType(DataHelper.thingType().Name);
    assert.strictEqual(things.value[0]._name, DataHelper.thing()._name);
    [DataHelper.data.thing] = things.value;
    return client.createEvent(DataHelper.event());
  });
});
