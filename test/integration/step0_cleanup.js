const assert = require('assert');
const LeonardoIoT = require('../../lib/LeonardoIoT');
const DataHelper = require('./helper/DataHelper');
const requestHelper = require('./helper/requestHelper');

describe('0) Cleanup and prepare', function () {
    let client;

    before(async function () {
        client = new LeonardoIoT();
        try {
            await DataHelper.init(client);
        } catch (error) {
            assert.fail(error);
        }
    });

    it('cleanup', async function () {
        const packageExists = await client.getPackage(DataHelper.package().Name).catch(()=>{
            assert.ok(true, 'Package not found');
        });
        try {
            if (packageExists) {
                await requestHelper.deletePackageCascading(client, DataHelper.package().Name);
            }
            const objectGroupResponse = await client.getObjectGroups({
                $filter: `name eq ${DataHelper.objectGroup().name}`
            });
            const deleteObjectGroupPromises = objectGroupResponse.value.map((objectGroup) => {
                return client.deleteObjectGroup(objectGroup.objectGroupID, objectGroup.etag);
            });
            return Promise.all(deleteObjectGroupPromises);
        } catch (err) {
            assert.fail(err);
        }
    });
});
