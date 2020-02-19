const LeonardoIoT = require('../../lib/LeonardoIoT');
const DataHelper = require('./helper/DataHelper');
const requestHelper = require('./helper/requestHelper');
const assert = require('assert');

describe('0) Cleanup and prepare', function () {
    let client;

    before(async function () {
        client = new LeonardoIoT();
        try{
            await DataHelper.init(client);
        }catch(error){
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
            const deleteObjectGroupPromises = [];
            for (const objectGroup of objectGroupResponse.value) {
                deleteObjectGroupPromises.push(client.deleteObjectGroup(objectGroup.objectGroupID, objectGroup.etag));
            }
            return Promise.all(deleteObjectGroupPromises);
        } catch (err) {
            assert.fail(err);
        }
    });
});
