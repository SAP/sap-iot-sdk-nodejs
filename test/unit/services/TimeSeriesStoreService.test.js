const AssertionUtil = require('../AssertionUtil');
const LeonardoIoT = require('../../../lib/LeonardoIoT');

const appiotMdsUrl = 'https://appiot-mds.cfapps.eu10.hana.ondemand.com';

describe('Time Series Store', () => {
    let client;

    beforeEach(() => {
        client = new LeonardoIoT();
    });

    describe('Time Series Data', () => {
        it('create', async () => {
            const thingId = 'MyThing';
            const thingTypeName = 'MyThingType';
            const propertySetId = 'MyPropertySet';
            const timeSeriesPayload = {value: [{Temperature: '25', _time: new Date().toISOString()}]};

            client.request = function (requestConfig) {
                AssertionUtil.assertRequestConfig(requestConfig, {
                    url: `${appiotMdsUrl}/Things('${thingId}')/${thingTypeName}/${propertySetId}`,
                    method: 'PUT',
                    body: timeSeriesPayload
                });
            };
            await client.createTimeSeriesData(thingId, thingTypeName, propertySetId, timeSeriesPayload);
        });

        it('read', async () => {
            const thingId = 'MyThing';
            const thingTypeName = 'MyThingType';
            const propertySetId = 'MyPropertySet';
            client.request = function (requestConfig) {
                AssertionUtil.assertRequestConfig(requestConfig, {
                    url: `${appiotMdsUrl}/Things('${thingId}')/${thingTypeName}/${propertySetId}`,
                });
            };

            await client.getTimeSeriesData(thingId, thingTypeName, propertySetId);
        });

        it('read thing snapshot', async () => {
            const thingId = 'MyThing';
            client.request = function (requestConfig) {
                AssertionUtil.assertRequestConfig(requestConfig, {
                    url: `${appiotMdsUrl}/Snapshot(thingId='${thingId}',fromTime='',dataCategory='')`,
                });
            };

            await client.getThingSnapshot(thingId);
        });

        it('delete', async () => {
            const thingId = 'MyThing';
            const thingTypeName = 'MyThingType';
            const propertySetId = 'MyPropertySet';
            const fromTime = '2019-06-15T08:00:00Z';
            const toTime = '2019-06-15T20:00:00Z';
            client.request = function (requestConfig) {
                AssertionUtil.assertRequestConfig(requestConfig, {
                    url: `${appiotMdsUrl}/Things('${thingId}')/${thingTypeName}/${propertySetId}?timerange=${fromTime}-${toTime}`,
                    method: 'DELETE'
                });
            };

            await client.deleteTimeSeriesData(thingId, thingTypeName, propertySetId, fromTime, toTime);
        });
    });
});
