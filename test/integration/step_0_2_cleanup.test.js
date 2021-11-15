const assert = require('assert');
const LeonardoIoT = require('../../lib/LeonardoIoT');
const DataHelper = require('./helper/DataHelper');
const requestHelper = require('./helper/requestHelper');

describe('Cleanup and Prepare', function () {
  let client;

  // eslint-disable-next-line mocha/no-hooks-for-single-case
  before(async function () {
    client = new LeonardoIoT();
    await DataHelper.init(client);
  });

  // eslint-disable-next-line consistent-return
  it('should do cleanup', async function () {
    this.timeout(180000);
    const package = await client.getPackage(DataHelper.package().Name).catch(() => {
      assert.ok(true, 'Package not found');
    });
    if (package) {
      await requestHelper.deletePackageCascading(client, DataHelper.package().Name);
    }
    const objectGroupResponse = await client.getObjectGroups({
      $filter: `name eq ${DataHelper.objectGroup().name}`,
    });
    const deleteObjectGroupPromises = objectGroupResponse.value.map((objectGroup) => client.deleteObjectGroup(objectGroup.objectGroupID, objectGroup.etag));
    return Promise.all(deleteObjectGroupPromises);
  });
});
