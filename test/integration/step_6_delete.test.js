const assert = require('assert');
const LeonardoIoT = require('../../lib/LeonardoIoT');
const DataHelper = require('./helper/DataHelper');

describe('Delete Entities', function () {
  let client;

  before(function () {
    client = new LeonardoIoT();
  });

  it('should delete all things', async function () {
    const things = await client.getThingsByThingType(DataHelper.thingType().Name);
    assert(things.value.length > 0, 'No thing found for deletion');
    const deleteThingPromises = things.value.map((thing) => client.deleteThing(thing._id));
    return Promise.all(deleteThingPromises);
  });

  it('should delete all object groups', async function () {
    const objectGroups = await client.getObjectGroups({
      $filter: `name eq ${DataHelper.objectGroup().name}`,
    });
    const deleteObjectGroupPromises = objectGroups.value.map((objectGroup) => client.deleteObjectGroup(objectGroup.objectGroupID, objectGroup.etag));
    return Promise.all(deleteObjectGroupPromises);
  });

  it('should delete a thing types', async function () {
    const thingTypeResponse = await client.getThingType(DataHelper.thingType().Name, {}, { resolveWithFullResponse: true });
    return client.deleteThingType(DataHelper.thingType().Name, thingTypeResponse.headers.etag);
  });

  it('should delete a property set types', async function () {
    const propertySetTypeResponse = await client.getPropertySetType(DataHelper.propertySetType().Name, {}, { resolveWithFullResponse: true });
    return client.deletePropertySetType(DataHelper.propertySetType().Name, propertySetTypeResponse.headers.etag);
  });

  it('should delete a package', async function () {
    const packageResponse = await client.getPackage(DataHelper.package().Name, { resolveWithFullResponse: true });
    return client.deletePackage(DataHelper.package().Name, packageResponse.headers.etag);
  });
});
