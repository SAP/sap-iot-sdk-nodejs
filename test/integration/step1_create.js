const assert = require('assert');
const LeonardoIoT = require('../../lib/LeonardoIoT');
const DataHelper = require('./helper/DataHelper');

describe('1) CREATE', function () {
    let client;

    before(function () {
        client = new LeonardoIoT();
    });

    it('package', function () {
        return client.createPackage(DataHelper.package());
    });

    it('property set type', function () {
        return client.createPropertySetType(DataHelper.package().Name, DataHelper.propertySetType());
    });

    it('thing type', function () {
        return client.createThingType(DataHelper.package().Name, DataHelper.thingType());
    });

    it('object group', function () {
        return client.createObjectGroup(DataHelper.objectGroup());
    });

    it('thing', function () {
        return client.createThing(DataHelper.thing());
    });

    it('event', async function () {
        try {
            const things = await client.getThingsByThingType(DataHelper.thingType().Name);
            DataHelper.data.thing = things.value[0];
        } catch (error) {
            assert.fail(error);
        }
        return client.createEvent(DataHelper.event());
    });
});
