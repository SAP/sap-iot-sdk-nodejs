## Migration Guide
This migration guide supports you in adapting your source code from the deprecated [IoT Application Services SDK](https://github.com/SAP/iot-application-services-sdk-nodejs) to the newly released [SAP Leonardo IoT SDK](https://github.com/SAP/sap-iot-sdk-nodejs) step by step.
Before starting the migration we highly recommend to read the [documentation](./README.md) and have a look at the samples of the new SDK to ensure all concepts and features are known.

#### 1) Update Dependency
Remove existing dependency from package.json via command:
```
$ npm uninstall SAP/iot-application-services-sdk-nodejs
```

Next install the latest version of the new Leonardo IoT SDK:
```
$ npm install SAP/sap-iot-sdk-nodejs --save
```

#### 2) Adapt tenant credential configuration
For Leonardo IoT SDK all access credentials are maintained in the application runtime environment, there is no `.env` file used anymore. 
For Cloud Foundry deployments, all credentials are fetched from application service bindings, in case of local operation the environment is configured in the file `default-env.json`.

2.1) Remove existing .env files from project root directory

2.2) Follow [this step](https://github.com/SAP/sap-iot-sdk-nodejs#2-setup-authorization-for-local-usage) and store the file in the projects root directory 

2.3) Copy Leonardo IoT service key of your tenant into template and rename the file to `default-env.json`.


#### 3) Replace requirements and client instantiation
Replace all require statements and also align variable names:
```js
//  OLD CODING
const AE = require('iot-application-services-sdk-nodejs');
const client = new AE();
 
//  NEW CODING
const LeonardoIoT = require('sap-iot-sdk');
const client = new LeonardoIoT();
```

#### 4) Adapt service calls
All functionality from the [feature overview table](./README.md#feature-overview) can be called by a designated function of the instantiated Leonardo IoT client:  

```js
const LeonardoIoT = require('sap-iot-sdk');
const client = new LeonardoIoT();

// Read things
const things = await client.getThings();
```

In case your used functionality is not covered by a designated function, you can send the request by using a general request facade of the client:
```js
const LeonardoIoT = require('sap-iot-sdk');
const client = new LeonardoIoT();

// Read assignments
let url = client.navigator.getDestination('tm-data-mapping') + '/v1/assignments';
const assignments = await client.request({url});
```

#### 5) Test your project
That's is! Last step is to run your applications unit and integration tests as well as some manual tests. If this guide was missing any step please feel free to let us know by creating an [Github Issue](https://github.com/SAP/sap-iot-sdk-nodejs/issues) with an attached migration label.



