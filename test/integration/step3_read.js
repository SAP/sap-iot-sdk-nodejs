const assert = require('assert');
const LeonardoIoT = require('../../lib/LeonardoIoT');
const DataHelper = require('./helper/DataHelper');

describe('3) READ', function () {
    let client;

    before(function () {
        client = new LeonardoIoT();
    });

    it('package', function () {
        return client.getPackage(DataHelper.package().Name);
    });

    it('property set type', function () {
        return client.getPropertySetType(DataHelper.propertySetType().Name);
    });

    it('thing type', function () {
        return client.getThingType(DataHelper.thingType().Name);
    });

    it('object group', async function () {
        await client.getObjectGroup(DataHelper.data.objectGroup.objectGroupID);
        return client.getRootObjectGroup();
    });

    it('thing', async function () {
        try {
            await client.getThing(DataHelper.data.thing._id);
        } catch (error) {
            assert.fail(error);
        }
        return client.getThingByAlternateId(DataHelper.data.thing._alternateId);
    });

    it('event', async function () {
        return client.getEvent(DataHelper.data.event._id);
    });
});
