const assert = require('assert');
const LeonardoIoT = require('../../lib/LeonardoIoT');
const DataHelper = require('./helper/DataHelper');

describe('Create Entities', function () {
  let client;

  before(function () {
    client = new LeonardoIoT();
  });

  it('should create a package', async function () {
    const response = await client.createPackage(DataHelper.package());
    assert.strictEqual(response.d.Status, 'Active');
  });

  it('should create a property set type', async function () {
    const response = await client.createPropertySetType(DataHelper.package().Name, DataHelper.propertySetType());
    assert.strictEqual(response.d.Name, DataHelper.propertySetType().Name);
  });

  it('should create a thing type', async function () {
    const response = await client.createThingType(DataHelper.package().Name, DataHelper.thingType());
    assert.strictEqual(response.d.Name, DataHelper.thingType().Name);
  });

  it('should create a object group', function () {
    return client.createObjectGroup(DataHelper.objectGroup());
  });

  it('should create a thing', function () {
    return client.createThing(DataHelper.thing());
  });
});
