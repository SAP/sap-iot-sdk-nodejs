const assert = require('assert');
const LeonardoIoT = require('../../lib/LeonardoIoT');
const DataHelper = require('./helper/DataHelper');

describe('6) DELETE', () => {
    let client;

    before(async () => {
        client = new LeonardoIoT();
    });

    it('event', async () => {
        const events = await client.getEventsByThingId(DataHelper.data.thing._id);
        assert(events.value.length > 0, 'No event found for deletion');
        for (const event of events.value) {
            await client.deleteEvent(event._id);
        }
    });

    it('thing', async () => {
        const things = await client.getThingsByThingType(DataHelper.thingType().Name);
        assert(things.value.length > 0, 'No thing found for deletion');
        for (const thing of things.value) {
            await client.deleteThing(thing._id);
        }
    });

    it('object group', async () => {
        const objectGroups = await client.getObjectGroups({
            $filter: `name eq ${DataHelper.objectGroup().name}`
        });

        for (const objectGroup of objectGroups.value) {
            await client.deleteObjectGroup(objectGroup.objectGroupID, objectGroup.etag);
        }
    });

    it('thing type', async () => {
        const thingTypeResponse = await client.getThingType(DataHelper.thingType().Name, {}, {resolveWithFullResponse: true});
        await client.deleteThingType(DataHelper.thingType().Name, thingTypeResponse.headers.etag);
    });

    it('property set type', async () => {
        const propertySetTypeResponse = await client.getPropertySetType(DataHelper.propertySetType().Name, {}, {resolveWithFullResponse: true});
        await client.deletePropertySetType(DataHelper.propertySetType().Name, propertySetTypeResponse.headers.etag);
    });

    it('package', async () => {
        const packageResponse = await client.getPackage(DataHelper.package().Name, {resolveWithFullResponse: true});
        await client.deletePackage(DataHelper.package().Name, packageResponse.headers.etag);
    });
});
