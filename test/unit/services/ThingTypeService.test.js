const AssertionUtil = require('../AssertionUtil');
const LeonardoIoT = require('../../../lib/LeonardoIoT');

const configThingUrl = 'https://config-thing-sap.cfapps.eu10.hana.ondemand.com';

describe('Thing Type Service', function () {
    let client;

    beforeEach(function () {
        client = new LeonardoIoT();
    });

    describe('ThingType', function () {
        it('create', function () {
            const packageName = 'MyPackage';
            const thingTypePayload = {Name: 'MyThingType'};
            client.request = (requestConfig) => {
                AssertionUtil.assertRequestConfig(requestConfig, {
                    url: `${configThingUrl}/ThingConfiguration/v2/Packages('${packageName}')/ThingTypes`,
                    method: 'POST',
                    body: thingTypePayload
                });
            };

            return client.createThingType(packageName, thingTypePayload);
        });

        it('read single', function () {
            const thingTypeName = 'MyThingType';
            client.request = (requestConfig) => {
                AssertionUtil.assertRequestConfig(requestConfig, {
                    url: `${configThingUrl}/ThingConfiguration/v1/ThingTypes('${thingTypeName}')`,
                });
            };

            return client.getThingType(thingTypeName);
        });

        it('read multiple', function () {
            client.request = (requestConfig) => {
                AssertionUtil.assertRequestConfig(requestConfig, {
                    url: `${configThingUrl}/ThingConfiguration/v1/ThingTypes`,
                });
            };

            return client.getThingTypes();
        });

        it('read multiple by package', function () {
            const packageName = 'MyPackage';
            client.request = (requestConfig) => {
                AssertionUtil.assertRequestConfig(requestConfig, {
                    url: `${configThingUrl}/ThingConfiguration/v1/Packages('${packageName}')/ThingTypes`,
                });
            };

            return client.getThingTypesByPackage(packageName);
        });

        it('delete', function () {
            const thingTypeName = 'MyThingType';
            const etag = '8f9da184-5af1-4237-8ede-a7fee8ddc57e';
            client.request = (requestConfig) => {
                AssertionUtil.assertRequestConfig(requestConfig, {
                    url: `${configThingUrl}/ThingConfiguration/v1/ThingTypes('${thingTypeName}')`,
                    method: 'DELETE',
                    headers: {'If-Match': etag}
                });
            };

            return client.deleteThingType(thingTypeName, etag);
        });
    });
});
