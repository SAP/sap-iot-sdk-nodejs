const assert = require('assert');
const LeonardoIoT = require('../../lib/LeonardoIoT');
const DataHelper = require('./helper/DataHelper');

describe('3) READ', function () {
  let client;

  before(function () {
    client = new LeonardoIoT();
  });

  it('package', async function () {
    const response = await client.getPackage(DataHelper.package().Name);
    assert.strictEqual(response.d.Name, DataHelper.package().Name);
  });

  it('property set type', async function () {
    const response = await client.getPropertySetType(DataHelper.propertySetType().Name);
    assert.strictEqual(response.d.Name, DataHelper.propertySetType().Name);
  });

  it('thing type', async function () {
    const response = await client.getThingType(DataHelper.thingType().Name);
    assert.strictEqual(response.d.Name, DataHelper.thingType().Name);
  });

  it('object group', async function () {
    const response = await client.getObjectGroup(DataHelper.data.objectGroup.objectGroupID);
    assert.strictEqual(response.objectGroupID, DataHelper.data.objectGroup.objectGroupID);
  });

  it('root object group', async function () {
    const response = await client.getRootObjectGroup();
    assert.strictEqual(response.objectGroupID, DataHelper.rootObjectGroup.objectGroupID);
  });

  it('thing', async function () {
    const response = await client.getThing(DataHelper.data.thing._id);
    assert.strictEqual(response._id, DataHelper.data.thing._id);
  });

  it('thing by alternate id', async function () {
    const response = await client.getThingByAlternateId(DataHelper.data.thing._alternateId);
    assert.strictEqual(response._alternateId, DataHelper.data.thing._alternateId);
  });

  it('event', async function () {
    const response = await client.getEvent(DataHelper.data.event._id);
    assert.strictEqual(response._id, DataHelper.data.event._id);
  });
});
