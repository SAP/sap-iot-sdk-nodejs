/* eslint-disable max-len, no-console */
console.log('Setting mocha test environment variables');
console.log('SET VCAP_SERVICES');
process.env.VCAP_SERVICES = JSON.stringify({
  iotae: [{
    name: 'iot_internal',
    plan: 'standard',
    tags: ['leonardoiot'],
    credentials: {
      endpoints: {
        'tm-data-mapping': 'https://tm-data-mapping.cfapps.eu10.hana.ondemand.com',
        authorization: 'https://authorization.cfapps.eu10.hana.ondemand.com',
        'appiot-mds': 'https://appiot-mds.cfapps.eu10.hana.ondemand.com',
        'appiot-coldstore': 'https://appiot-coldstore.cfapps.eu10.hana.ondemand.com',
        'config-thing-sap': 'https://config-thing-sap.cfapps.eu10.hana.ondemand.com',
        'config-package-sap': 'https://config-package-sap.cfapps.eu10.hana.ondemand.com',
        'analytics-thing-sap': 'https://analytics-thing-sap.cfapps.eu10.hana.ondemand.com',
        'rules-designtime': 'https://sap-iot-noah-live-rules-designtime.cfapps.eu10.hana.ondemand.com',
        'business-partner': 'https://business-partner.cfapps.eu10.hana.ondemand.com',
      },
      uaa: {
        uaadomain: 'authentication.eu10.hana.ondemand.com',
        tenantmode: 'dedicated',
        sburl: 'https://internal-xsuaa.authentication.eu10.hana.ondemand.com',
        clientid: 'MyClientId',
        apiurl: 'https://api.authentication.eu10.hana.ondemand.com',
        xsappname: 'saptest!b16977|iotae_service!b5',
        identityzone: 'saptest',
        identityzoneid: '92da712a-4ce5-40d9-9d8f-b6a6d47a58aa',
        verificationkey: '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyp0tzyIJXpPYJxbkOzaXXahj90c6wJqeLkTFiPZu8yF0jQTPtIIEFwSRetJqImI+iJ9EaF0ZsemzZiptMlrVTBZec2JM4pJv/OAvJeT8I7EKu57IXDeGos+Pxjj04SBqCnCvIvtlwdsCTzotRUv2fEL7NJXzxtpxQ8AQRkEQ4+FAIe/yGX8cP/dIoXwbdM6NvkDU3QHcjHMPdZ6/s+sI+E2orFv4qYTj8NYqymXeJeWe31xSL/fJaX3Wo0NaoZuyh0MJOvA0D7bWqKw/ZBF7A05PiqozeAzhYeSvQSsNQ2dc9tmDadLTF8Q9BwURgejGOpvAxdJ3wEVWTohC3Sv6nQIDAQAB-----END PUBLIC KEY-----',
        clientsecret: 'MyClientSecret',
        tenantid: '92da712a-4ce5-40d9-9d8f-b6a6d47a58aa',
        url: 'https://saptest.authentication.eu10.hana.ondemand.com',
      },
    },
  }],
  'user-provided': [
    {
      name: 'sap-iot-account-test',
      credentials: {
        endpoints: {
          'appiot-mds': 'https://appiot-mds-backup.cfapps.de01.hana.ondemand.com',
        },
        uaa: {
          url: 'https://testAccountUrl',
          clientid: 'testAccountId',
          clientsecret: 'testAccountSecret',
          verificationkey: '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyp0tzyIJXpPYJxbkOzaXXahj90c6wJqeLkTFiPZu8yF0jQTPtIIEFwSRetJqImI+iJ9EaF0ZsemzZiptMlrVTBZec2JM4pJv/OAvJeT8I7EKu57IXDeGos+Pxjj04SBqCnCvIvtlwdsCTzotRUv2fEL7NJXzxtpxQ8AQRkEQ4+FAIe/yGX8cP/dIoXwbdM6NvkDU3QHcjHMPdZ6/s+sI+E2orFv4qYTj8NYqymXeJeWe31xSL/fJaX3Wo0NaoZuyh0MJOvA0D7bWqKw/ZBF7A05PiqozeAzhYeSvQSsNQ2dc9tmDadLTF8Q9BwURgejGOpvAxdJ3wEVWTohC3Sv6nQIDAQAB-----END PUBLIC KEY-----',
        },
      },
    },
    {
      name: 'sap-iot-account-dev',
      credentials: {
        endpoints: {
          'appiot-mds': 'https://appiot-mds-backup.cfapps.de01.hana.ondemand.com',
        },
        uaa: {
          url: 'https://devAccountUrl',
          clientid: 'devAccountId',
          clientsecret: 'devAccountSecret',
          verificationkey: '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyp0tzyIJXpPYJxbkOzaXXahj90c6wJqeLkTFiPZu8yF0jQTPtIIEFwSRetJqImI+iJ9EaF0ZsemzZiptMlrVTBZec2JM4pJv/OAvJeT8I7EKu57IXDeGos+Pxjj04SBqCnCvIvtlwdsCTzotRUv2fEL7NJXzxtpxQ8AQRkEQ4+FAIe/yGX8cP/dIoXwbdM6NvkDU3QHcjHMPdZ6/s+sI+E2orFv4qYTj8NYqymXeJeWe31xSL/fJaX3Wo0NaoZuyh0MJOvA0D7bWqKw/ZBF7A05PiqozeAzhYeSvQSsNQ2dc9tmDadLTF8Q9BwURgejGOpvAxdJ3wEVWTohC3Sv6nQIDAQAB-----END PUBLIC KEY-----',
        },
      },
    },
  ],
  xsuaa: [
    {
      credentials: {
        apiurl: 'https://api.authentication.eu10.hana.ondemand.com',
        clientid: 'xsuaaClientId',
        clientsecret: 'xsuaaClientSecret',
        identityzone: 'sap-test',
        identityzoneid: 'ade586c6-f5b1-4ddc-aecb-ead3c2e6e725',
        verificationkey: '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyp0tzyIJXpPYJxbkOzaXXahj90c6wJqeLkTFiPZu8yF0jQTPtIIEFwSRetJqImI+iJ9EaF0ZsemzZiptMlrVTBZec2JM4pJv/OAvJeT8I7EKu57IXDeGos+Pxjj04SBqCnCvIvtlwdsCTzotRUv2fEL7NJXzxtpxQ8AQRkEQ4+FAIe/yGX8cP/dIoXwbdM6NvkDU3QHcjHMPdZ6/s+sI+E2orFv4qYTj8NYqymXeJeWe31xSL/fJaX3Wo0NaoZuyh0MJOvA0D7bWqKw/ZBF7A05PiqozeAzhYeSvQSsNQ2dc9tmDadLTF8Q9BwURgejGOpvAxdJ3wEVWTohC3Sv6nQIDAQAB-----END PUBLIC KEY-----',
        sburl: 'https://internal-xsuaa.authentication.eu10.hana.ondemand.com',
        tenantid: 'ade586c6-f5b1-4ddc-aecb-ead3c2e6e725',
        tenantmode: 'dedicated',
        uaadomain: 'authentication.eu10.hana.ondemand.com',
        url: 'https://sap-test.authentication.eu10.hana.ondemand.com',
        xsappname: 'sap-test!t4969',
      },
      name: 'test-uaa',
      tags: [
        'xsuaa',
      ],
    },
  ],
});
