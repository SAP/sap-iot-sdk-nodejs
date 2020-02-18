const assert = require('assert');
const LeonardoIoT = require('../../lib/LeonardoIoT');
const DataHelper = require('./helper/DataHelper');

describe('6) DELETE', function () {
    let client;

    before(function () {
        client = new LeonardoIoT();
    });

    it('event', async function () {
        const events = await client.getEventsByThingId(DataHelper.data.thing._id);
        assert(events.value.length > 0, 'No event found for deletion');
        const deleteEventPromises = []
        for (const event of events.value) {
            deleteEventPromises.push(client.deleteEvent(event._id));
        }
        return Promise.all(deleteEventPromises);
    });

    it('thing', async function () {
        const things = await client.getThingsByThingType(DataHelper.thingType().Name);
        assert(things.value.length > 0, 'No thing found for deletion');
        const deleteThingPromises = [];
        for (const thing of things.value) {
            deleteThingPromises.push(client.deleteThing(thing._id));
        }
        return Promise.all(deleteThingPromises);
    });

    it('object group', async function () {
        const objectGroups = await client.getObjectGroups({
            $filter: `name eq ${DataHelper.objectGroup().name}`
        });
        const deleteObjectGroupPromises = [];
        for (const objectGroup of objectGroups.value) {
            deleteObjectGroupPromises.push(client.deleteObjectGroup(objectGroup.objectGroupID, objectGroup.etag));
        }
        return Promise.all(deleteObjectGroupPromises);
    });

    it('thing type', async function () {
        const thingTypeResponse = await client.getThingType(DataHelper.thingType().Name, {}, {resolveWithFullResponse: true});
        return client.deleteThingType(DataHelper.thingType().Name, thingTypeResponse.headers.etag);
    });

    it('property set type', async function () {
        const propertySetTypeResponse = await client.getPropertySetType(DataHelper.propertySetType().Name, {}, {resolveWithFullResponse: true});
        return client.deletePropertySetType(DataHelper.propertySetType().Name, propertySetTypeResponse.headers.etag);
    });

    it('package', async function () {
        const packageResponse = await client.getPackage(DataHelper.package().Name, {resolveWithFullResponse: true});
        return client.deletePackage(DataHelper.package().Name, packageResponse.headers.etag);
    });
});
