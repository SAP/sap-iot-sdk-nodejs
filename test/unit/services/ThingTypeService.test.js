const AssertionUtil = require('../AssertionUtil');
const LeonardoIoT = require('../../../lib/LeonardoIoT');

const configThingUrl = 'https://config-thing-sap.cfapps.eu10.hana.ondemand.com';

describe('Thing Type Service', function () {
  let client;
  let queryParameters;
  let queryKey;
  let queryValue;

  before(function () {
    queryParameters = {};
    queryKey = '$expand';
    queryValue = 'Descriptions';
    queryParameters[queryKey] = queryValue;
  });

  beforeEach(function () {
    client = new LeonardoIoT();
  });

  describe('ThingType', function () {
    it('should create thingType', function () {
      const packageName = 'MyPackage';
      const thingTypePayload = { Name: 'MyThingType' };
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${configThingUrl}/ThingConfiguration/v2/Packages('${packageName}')/ThingTypes`,
          method: 'POST',
          body: thingTypePayload,
        });
      };
      return client.createThingType(packageName, thingTypePayload);
    });

    it('should read single thingType', function () {
      const thingTypeName = 'MyThingType';
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${configThingUrl}/ThingConfiguration/v1/ThingTypes('${thingTypeName}')`,
        });
      };
      return client.getThingType(thingTypeName);
    });

    it('should read single thingType with query parameters', function () {
      const thingTypeName = 'MyThingType';
      const queryParatemeters = {};
      queryParatemeters[queryKey] = queryValue;
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${configThingUrl}/ThingConfiguration/v1/ThingTypes('${thingTypeName}')`,
          qs: queryParameters,
        });
      };
      return client.getThingType(thingTypeName, queryParameters);
    });

    it('should read multiple thingTypes', function () {
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${configThingUrl}/ThingConfiguration/v1/ThingTypes`,
        });
      };
      return client.getThingTypes();
    });

    it('should read multiple thingTypes with query parameters', function () {
      const queryParatemeters = {};
      queryParatemeters[queryKey] = queryValue;
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${configThingUrl}/ThingConfiguration/v1/ThingTypes`,
          qs: queryParameters,
        });
      };
      return client.getThingTypes(queryParameters);
    });

    it('should read multiple thingType by package', function () {
      const packageName = 'MyPackage';
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${configThingUrl}/ThingConfiguration/v1/Packages('${packageName}')/ThingTypes`,
        });
      };
      return client.getThingTypesByPackage(packageName);
    });

    it('should read multiple thingType by package with query parameters', function () {
      const packageName = 'MyPackage';
      const queryParatemeters = {};
      queryParatemeters[queryKey] = queryValue;
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${configThingUrl}/ThingConfiguration/v1/Packages('${packageName}')/ThingTypes`,
          qs: queryParatemeters,
        });
      };
      return client.getThingTypesByPackage(packageName, queryParameters);
    });

    it('should delete thingType', function () {
      const thingTypeName = 'MyThingType';
      const etag = '8f9da184-5af1-4237-8ede-a7fee8ddc57e';
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${configThingUrl}/ThingConfiguration/v1/ThingTypes('${thingTypeName}')`,
          method: 'DELETE',
          headers: { 'If-Match': etag },
        });
      };
      return client.deleteThingType(thingTypeName, etag);
    });
  });
});
