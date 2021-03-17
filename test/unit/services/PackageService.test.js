const AssertionUtil = require('../AssertionUtil');
const LeonardoIoT = require('../../../lib/LeonardoIoT');

const configPackageUrl = 'https://config-package-sap.cfapps.eu10.hana.ondemand.com';

describe('Package Service', function () {
  let client;

  beforeEach(function () {
    client = new LeonardoIoT();
  });

  describe('Package', function () {
    it('should create new package', function () {
      const packagePayload = { Name: 'MyPackage' };
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${configPackageUrl}/Package/v1/Packages`,
          method: 'POST',
          body: packagePayload,
        });
      };

      return client.createPackage(packagePayload);
    });

    it('should read single package', function () {
      const packageName = 'MyPackage';
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${configPackageUrl}/Package/v1/Packages('${packageName}')`,
        });
      };

      return client.getPackage(packageName);
    });

    it('should read multiple packages', function () {
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${configPackageUrl}/Package/v1/Packages`,
        });
      };

      return client.getPackages();
    });

    it('should delete package', function () {
      const packageName = 'MyPackage';
      const etag = '8f9da184-5af1-4237-8ede-a7fee8ddc57e';
      client.request = (requestConfig) => {
        AssertionUtil.assertRequestConfig(requestConfig, {
          url: `${configPackageUrl}/Package/v1/Packages('${packageName}')`,
          method: 'DELETE',
          headers: { 'If-Match': etag },
        });
      };

      return client.deletePackage(packageName, etag);
    });
  });
});
