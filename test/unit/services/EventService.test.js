const AssertionUtil = require('../AssertionUtil');
const LeonardoIoT = require('../../../lib/LeonardoIoT');

const appiotMdsUrl = 'https://appiot-mds.cfapps.eu10.hana.ondemand.com';

describe('Event Service', () => {
    let client;

    beforeEach(() => {
        client = new LeonardoIoT();
    });

    describe('Event', () => {
        it('create', async () => {
            const thingId = 'MyThing';
            const eventPayload = {_status: 'Open', _code: 'T1', _thingId: thingId};
            client.request = function (requestConfig) {
                AssertionUtil.assertRequestConfig(requestConfig, {
                    url: `${appiotMdsUrl}/Events`,
                    method: 'POST',
                    body: eventPayload
                });
            };

            await client.createEvent(eventPayload);
        });

        it('read single', async () => {
            const eventId = 'MyEvent';
            client.request = function (requestConfig) {
                AssertionUtil.assertRequestConfig(requestConfig, {
                    url: `${appiotMdsUrl}/Events('${eventId}')`,
                });
            };

            await client.getEvent(eventId);
        });

        it('read multiple', async () => {
            client.request = function (requestConfig) {
                AssertionUtil.assertRequestConfig(requestConfig, {
                    url: `${appiotMdsUrl}/Events`,
                });
            };

            await client.getEvents();
        });

        it('read multiple with different query parameters', async () => {
            client.request = function (requestConfig) {
                AssertionUtil.assertRequestConfig(requestConfig, {
                    url: `${appiotMdsUrl}/Events?$select=_thingId,_status&$orderby=_thingId&$top=10&$skip=5`,
                });
            };

            await client.getEvents({
                $select: '_thingId,_status', $orderby: '_thingId', $top: 10, $skip: 5
            });
        });

        it('read multiple by thing identifier', async () => {
            const thingId = 'MyThing';
            client.request = function (requestConfig) {
                AssertionUtil.assertRequestConfig(requestConfig, {
                    url: `${appiotMdsUrl}/Events?$filter=_thingId eq '${thingId}'`
                });
            };

            await client.getEventsByThingId(thingId);
        });

        it('read multiple by thing type with complex filter', async () => {
            const thingId = 'MyThing';
            client.request = function (requestConfig) {
                AssertionUtil.assertRequestConfig(requestConfig, {
                    url: `${appiotMdsUrl}/Events?$filter=_status eq 'Completed' and _thingId eq '${thingId}'`
                });
            };

            await client.getEventsByThingId(thingId, {$filter: "_status eq 'Completed'"});
        });

        it('delete', async () => {
            const eventId = 'MyEvent';
            client.request = function (requestConfig) {
                AssertionUtil.assertRequestConfig(requestConfig, {
                    url: `${appiotMdsUrl}/Events('${eventId}')`,
                    method: 'DELETE'
                });
            };

            await client.deleteEvent(eventId);
        });
    });
});
