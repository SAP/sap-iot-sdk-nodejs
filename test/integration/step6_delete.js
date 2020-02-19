const assert = require('assert');
const LeonardoIoT = require('../../lib/LeonardoIoT');
const DataHelper = require('./helper/DataHelper');

describe('6) DELETE', function () {
    let client;

    before(function () {
        client = new LeonardoIoT();
    });

    it('event', async function () {
        let events;
        try {
            events = await client.getEventsByThingId(DataHelper.data.thing._id);
        } catch (error) {
            assert.fail(error);
        }
        assert(events.value.length > 0, 'No event found for deletion');
        const deleteEventPromises = []
        for (const event of events.value) {
            deleteEventPromises.push(client.deleteEvent(event._id));
        }
        return Promise.all(deleteEventPromises);
    });

    it('thing', async function () {
        let things;
        try {
            things = await client.getThingsByThingType(DataHelper.thingType().Name);
        } catch (error) {
            assert.fail(error);
        }
        assert(things.value.length > 0, 'No thing found for deletion');
        const deleteThingPromises = [];
        for (const thing of things.value) {
            deleteThingPromises.push(client.deleteThing(thing._id));
        }
        return Promise.all(deleteThingPromises);
    });

    it('object group', async function () {
        let objectGroups;
        try {
            objectGroups = await client.getObjectGroups({
                $filter: `name eq ${DataHelper.objectGroup().name}`
            });
        } catch (error) {
            assert.fail(error);
        }
        const deleteObjectGroupPromises = [];
        for (const objectGroup of objectGroups.value) {
            deleteObjectGroupPromises.push(client.deleteObjectGroup(objectGroup.objectGroupID, objectGroup.etag));
        }
        return Promise.all(deleteObjectGroupPromises);
    });

    it('thing type', async function () {
        let thingTypeResponse;
        try {
            thingTypeResponse = await client.getThingType(DataHelper.thingType().Name, {}, {resolveWithFullResponse: true});
        } catch (error) {
            assert.fail(error);
        }
        return client.deleteThingType(DataHelper.thingType().Name, thingTypeResponse.headers.etag);
    });

    it('property set type', async function () {
        let propertySetTypeResponse;
        try {
            propertySetTypeResponse = await client.getPropertySetType(DataHelper.propertySetType().Name, {}, {resolveWithFullResponse: true});
        } catch (error) {
            assert.fail(error);
        }
        return client.deletePropertySetType(DataHelper.propertySetType().Name, propertySetTypeResponse.headers.etag);
    });

    it('package', async function () {
        let packageResponse;
        try {
            packageResponse = await client.getPackage(DataHelper.package().Name, {resolveWithFullResponse: true});
        } catch (error) {
            assert.fail(error);
        }
        return client.deletePackage(DataHelper.package().Name, packageResponse.headers.etag);
    });
});
