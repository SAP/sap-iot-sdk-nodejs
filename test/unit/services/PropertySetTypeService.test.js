const AssertionUtil = require('../AssertionUtil');
const LeonardoIoT = require('../../../lib/LeonardoIoT');

const configThingUrl = 'https://config-thing-sap.cfapps.eu10.hana.ondemand.com';

describe('Property Set Type Service', function () {
  let client;

  beforeEach(function () {
    client = new LeonardoIoT();
  });

  describe('PropertySetType', function () {
    it('should create PropertySetType', function () {
      const packageName = 'MyPackage';
      const propertySetTypePayload = { Name: 'MyPropertySetType' };
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${configThingUrl}/ThingConfiguration/v1/Packages('${packageName}')/PropertySetTypes`,
          method: 'POST',
          body: propertySetTypePayload,
        });
      };

      return client.createPropertySetType(packageName, propertySetTypePayload);
    });

    it('should read single propertySetType', function () {
      const propertySetTypeName = 'MyPropertySetType';
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${configThingUrl}/ThingConfiguration/v1/PropertySetTypes('${propertySetTypeName}')`,
        });
      };

      return client.getPropertySetType(propertySetTypeName);
    });

    it('should read multiple propertySetTypes', function () {
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${configThingUrl}/ThingConfiguration/v1/PropertySetTypes`,
        });
      };

      return client.getPropertySetTypes();
    });

    it('should read multiple propertySetTypes by package name', function () {
      const packageName = 'MyPackage';
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${configThingUrl}/ThingConfiguration/v1/Packages('${packageName}')/PropertySetTypes`,
        });
      };

      return client.getPropertySetTypesByPackage(packageName);
    });

    it('should delete propertySetType by name', function () {
      const propertySetTypeName = 'MyPropertySetType';
      const etag = '8f9da184-5af1-4237-8ede-a7fee8ddc57e';
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${configThingUrl}/ThingConfiguration/v1/PropertySetTypes('${propertySetTypeName}')`,
          method: 'DELETE',
          headers: { 'If-Match': etag },
        });
      };

      return client.deletePropertySetType(propertySetTypeName, etag);
    });
  });
});
