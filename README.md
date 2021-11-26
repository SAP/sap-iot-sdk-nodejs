# SAP IoT SDK for Node.js
[![REUSE status](https://api.reuse.software/badge/github.com/SAP/sap-iot-sdk-nodejs)](https://api.reuse.software/info/github.com/SAP/sap-iot-sdk-nodejs)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Library](https://github.com/SAP/sap-iot-sdk-nodejs/actions/workflows/library.yml/badge.svg)](https://github.com/SAP/sap-iot-sdk-nodejs/actions/workflows/library.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=sap-iot-sdk-nodejs&metric=alert_status)](https://sonarcloud.io/dashboard?id=sap-iot-sdk-nodejs)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=sap-iot-sdk-nodejs&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=sap-iot-sdk-nodejs)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=sap-iot-sdk-nodejs&metric=security_rating)](https://sonarcloud.io/dashboard?id=sap-iot-sdk-nodejs)

**Table of Contents**
- [Description](#description)
- [Requirements](#requirements)
- [Feature Overview](#feature-overview)
- [Download and Installation](#download-and-installation)
- [Samples](#samples)
- [Authorization Concept](#authorization-concept)
- [FAQ](#faq)
- [Contributions](#contribute-to-this-project)
- [Support](#how-to-obtain-support)

## Description
The SAP IoT SDK for Node.js implements the consumer side usage of the most frequent used APIs of SAP IoT. 
Also rarely used APIs which are not covered by designated service class functions can be called from this library by using a generic request facade.
All API calls will be automatically enriched with authorization information to ensure a simple consumption SAP IoT services.

To get started using the SAP IoT SDK check out the [Download and Installation](#download-and-installation) getting started guide.

## Requirements
It is required to have access to an SAP IoT account to make use of this SDK.

## Feature Overview

### Models
|                   | CREATE | READ | UPDATE | DELETE |
|-------------------|--------|------|--------|--------|
| Package           | X      | X    |        | X      |
| Property Set Type | X      | X    |        | X      |
| Thing Type        | X      | X    |        | X      |
| Thing             | X      | X    |        | X      |
| Object Group      | X      | X    |        | X      |

### Time Series Data
|                             | CREATE | READ | DELETE | OTHERS      |
|-----------------------------|--------|------|--------|-------------|
| Time Series Store           | X      | X    | X      |             |
| Time Series Cold Store      | X      | X    | X      |             |
| Time Series Aggregate Store |        | X    |        | recalculate |

## Download and Installation
This getting started guide will help you to make first usage of the SAP IoT SDK within your existing Node.js project.

### Prerequisites
Before starting with the SDK installation, please make sure that following prerequisites are fulfilled to ensure a successful flow through this getting started guide:

- Install your preferred editor or IDE.
- Basic JavaScript and NPM knowledge
- Local NPM installation
- SAP IoT account (service key access)

### 1) Install the SAP IoT SDK
If you do not already have a NPM project including a `package.json` file, let's create a new one by creating a new empty folder and running the following command within your prefered command line tool
```
$ npm init
```

Next you have to set the SAP registry as source for @sap scoped modules within your project
```
$ npm config set @sap:registry https://npm.sap.com
```

Afterwards the SAP IoT SDK can be installed and added to your new application's dependencies
```
$ npm install SAP/sap-iot-sdk-nodejs#v0.1.4 --save
```

### 2) Setup authorization for local usage
Each request to SAP IoT services requires an access token provided by an UAA instance to ensure authorization and authentication. The SDK takes care to enrich all service calls with a valid token itself, but therefore requires tenant specific credentials. In a productive setup all credentials are commonly provided from the runtime environment. For local usage, we will mock this environment in a file called `default-env.json`. 

First please create a blank file called `default-env.json`. Next you have to copy & paste the following template into this file:
```
{
  "VCAP_SERVICES": {
    "iotae": [
      {
        "name": "sap-iot-service",
        "tags": [
          "leonardoiot",
          "sapiot"
        ],
        "credentials": <PASTE SAP IOT SERVICE KEY HERE>
      }
    ],
    "user-provided": []
  }
}
```

In this initial setup the service name is just a meaningful sample and can be freely changed. But keep in mind that the *name* attribute is mandatory for every service. Please keep the tag definition untouched as the *leonardoiot* (former product name) tag identifies the SAP IoT service binding.

Last you have to copy the full content of your SAP IoT service key information from your subaccount's space ([service key creation documentation](https://help.sap.com/viewer/195126f4601945cba0886cbbcbf3d364/latest/en-US/a41c28db0cf449059d48c23fa5f7b24b.html)) and paste it into the placeholder part of the template file.

### 3) Create SAP IoT Client
Next please define a .js file which acts as application entry point (referenced by package.json). This file is named `index.js` in case you are using the default NPM project settings. Now let's create a SAP IoT client which will support you in accessing SAP IoT services within your code:
```js
const LeonardoIoT = require('sap-iot-sdk');
const client = new LeonardoIoT();
```

### 4) Usage for service interaction
The client is now able to communicate with SAP IoT services as it is fetching access credentials from the authorization setup file `default-env.json`. There is no more configuration required. Now you are able to perform your first service interaction using the SAP IoT client. Here is a simple runnable web server sample which can be copy & pasted into your index.js file:
```js
const { createServer } = require("http");
const LeonardoIoT = require('sap-iot-sdk');
const client = new LeonardoIoT();

createServer(async (request, response) => {
    if (request.url === '/things') {
        const things = await client.getThings();
        response.end(`THING LIST (${things.value.length})${things.value.map((thing, index) => `\n\n#${index + 1} ${thing._id} (${thing._name})`).join('')}`);
    }
}).listen(8080);
```

### 5) Run your code
After taking care about the project setup, client installation and implementation of the application entry point, you are ready to run your code.

First start your server locally:
```console
$ node index.js
```

Next open a browser and navigate to `http://localhost:8080/things`

Congratulation! You just performed your first API call to a SAP IoT service via the SDK for Node.js.

### 6) Optional: Run your application in Cloud Foundry
After starting your application locally you might want to deploy it to your subaccounts Cloud Foundry space. There is no code change required to do so, but now the `default-env.json` file will not have any effect as Cloud Foundry is providing the runtime environment itself. So let's tell Cloud Foundry what kind of services your application would like to bind.

First create a new file called `manifest.yml`, in which all deployment parameters of your application can be provided, in your project's root directory. Next you have to copy & paste the following template into this file:
```
---
applications:
- name: sap-iot-demo #choose unique app name to avoid conflicts with existing apps
  command: node index.js
  instances: 1
  memory: 128MB
  services:
   - <LeonardoIoTServiceName>
```

Now you have to fill the placeholder for the service name of your SAP IoT service instance. If you are not aware of this name, the following Cloud Foundry command line command could help:
```
# Windows User
$ cf services | findstr iotae

# Linux / Mac User
$ cf services | grep iotae
```

After maintaining all deployment related information you can push your application into your subaccount's Cloud Foundry space:
```
$ cf push
```

Now you should be able to see the thing list in your browser by opening the following url: `https://:<RouteOfApplication>/things`

Congratulation! You just successfully managed to deploy an first Cloud Foundry application calling SAP IoT services via the SDK.

### 7) How to continue
You just learned how to use the SAP IoT SDK locally and also deployed to Cloud Foundry. Now it is up to you to fetch business requirements and build your first business application with SAP IoT SDK.

Here are some more examples of different API calls via the SAP IoT client which show how easily the services can be consumed:
```js
// Read existing things
let things = await client.getThings();

// Create thing
await client.createThing(thingPayload);

// Read thing snapshot data
let snapshot = await client.getThingSnapshot(thingId);

// Delete thing
await client.deleteThing(thingId);
```

**HINT: All offered functions are documented with JSDoc and give you more information about parameters and API usage. Also each function referes to the API related SAP Help documentation containing full API specification and payload examples**

As some of the APIs also provide more functionality like ordering, selecting designated fields or top / skip functionality, there is always the option to enhance function calls by handover of custom query parameters:
```js
const things = await client.getThings(
    { 
      '$select': '_id,_name',
      '$orderby': '_id',
      '$top': 10
    },
    { 
      'resolveWithFullResponse': false,
      'headers' : {
        'Accept-Language' : 'en-US'
      }
    }
);
```

## Samples
We created a a few quick start samples demonstrating the SAP IoT JavaScript SDK functionality in a easy and simple adoptable way. Please have a look into the [***samples***](./samples) subdirectory for further information and coding samples.

## Authorization Concept
Each request to SAP IoT services requires an authorization token provided by an UAA instance to ensure authorization and authentication.
For more details please have a look in to the [SAP Help documentation](https://help.sap.com/viewer/65de2977205c403bbc107264b8eccf4b/Cloud/en-US/51ec15a8979e497fbcaadf80da9b63ba.html) or this [blog post](https://blogs.sap.com/2018/08/31/how-to-get-an-access-token-from-the-xsuaa-service-for-external-api-accesses-using-the-password-grant-with-client-and-user-credentials-method).

As this SDK is taking care of authorization handling, it is required to provide tenant specific configuration (service key) to ensure a successful client credential flow. This configuration is read from the runtime environment by using the `VCAP_SERVICES` variable when deployed to Cloud Foundry, and using the *default-env.json* file when running locally. This means that you do not have to adapt any coding and could deploy the same code base to different spaces for different subaccount.

**HINT**: Please handle this information very carefully and conscientious. Never publish it into any repository or file server and do not share it without any permission.

### Providing credentials and configuration

**Apply manual configuration**

Independent of your runtime environment you always have the option to handover all configurations manually within the SAP IoT client instantiation. Please be aware that a full configuration requires tenant credentials as well as API endpoint definitions. The following example demonstrates this pattern:
```js
const LeonardoIoT = require('sap-iot-sdk');
const client = new LeonardoIoT({
    // Mandatory configuration of SAP IoT subaccount credentials
    uaa: {
        clientid: "myClientId",
        clientsecret: "myClientSecret",
        url: "https://myTenant.authentication.eu10.hana.ondemand.com"
    },
    // Mandatory configuration of API endpoints called via the client from your script 
    endpoints: {
        "appiot-mds": "https://appiot-mds.cfapps.eu10.hana.ondemand.com",
        "config-thing-sap": "https://config-thing-sap.cfapps.eu10.hana.ondemand.com"
    },
    // Optional configuration of your own XSUAA instance, only used for token exchange
    xsuaa: {
        clientid: '',
        clientsecret: '',
        url: '',
        xsappname: '',
        identityzoneid: ''
    }
});
```

#### Cloud Foundry environment

**Option 1: SAP IoT service binding**

A very flexible and secure way of providing credentials is by fetching the tenant configuration from a service broker service binding of your application. This is the default option when no explicit service name is provided in SAP IoT client instantiation.
To make use of this option add the service broker service binding into the `manifest.yml` file, which is used for application deployment:
```
   services:
    - <LeonardoIoTServiceName>
```

Next you can directly create a SAP IoT client within your coding without providing any other information:
```js
const LeonardoIoT = require('sap-iot-sdk');
const client = new LeonardoIoT();
```

**Option 2: User provided service binding**

Especially in the case that you want to run an application which is handling data of multiple SAP IoT tenants (i.e. migrate data from your production subaccount to your development subaccount) you will make use of user provided service configurations. Here you have the possibility to create a SAP IoT client which is fetching its configuration from a manual provided service.

So first you have to bind the user provided services to your application within the related `manifest.yml` file:
```
   services:
    - sap-iot-prod-account
    - sap-iot-dev-account
```

Next you can create instances of the SAP IoT client within your coding by providing the service name in the instantiation:
```js
const LeonardoIoT = require('sap-iot-sdk');
const productionClient = new LeonardoIoT('sap-iot-prod-account');
const developmentClient = new LeonardoIoT('sap-iot-dev-account');
```

Be aware that the instantiation will fail in case the named service is not provided in your environment. The user provided service itself has to contain all tenant and landscape related information, best practice is to copy & paste the service key of your subaccount, and can be freely named to whatever fits your needs.

#### Local environment

**Provide environment in default-env.json file**

The same mechanisms as described in the Cloud Foundry environment also are taking place for local running applications. The SAP IoT SDK requires some credential and endpoint configuration, as it can be used for different tenants in different environments on different data centers. All these information is part of a SAP IoT service key which can be generated by a subaccount admin. The content of this service key has to be copied into a `default-env.json` file, which has to be placed on the projects root folder, so the SDK can also run on a local setup. If this file already exists as you may also include the SAP approuter into your project, feel free to just expand the existing file.

This example shows how the `default-env.json` could look like for using the SAP IoT service binding:
```
{
  "VCAP_SERVICES": {
    "iotae": [
      {
        "name": <ANY NAME>,
        "tags": [
          "leonardoiot"
        ],
        "credentials": <PASTE SAP IOT SERVICE KEY HERE>
      }
    ]
  }
}
```

The following example shows a setup using user provided services:
This example shows how the `default-env.json` could look like for using the SAP IoT service binding:
```
{
  "VCAP_SERVICES": {
    "user-provided": [
      {
        "name": <ANY NAME, USE THIS NAME IN CLINET INSTANTIATION>,
        "credentials": <PASTE SAP IOT SERVICE KEY HERE>
      }
    ]
  }
}
```

The SAP IoT service binding is identified by the *leonardoiot* (former product name) tag, so make sure that this service contains this tag in local setup. As user provided services are identified by their name, there is no need for any tag information.

### Token forwarding
In case you request any service via the SAP IoT SDK, an access token for a technical user (client credential flow) is requested and used for authentication. This is fine for automated scripts or background jobs, but most productive applications will be managed by users including user authentication. So in case you want to call any service in a user context, you have to provide a user token which is used instead of a technical user token. This service call will look similar to this example:

```js
// Forward token from incoming request
const things = await client.getThings(null, {'jwt': request.headers.authorization});
```

But now we got to the situation that a token, granted by your own uaa service, is forwarded to SAP IoT, which is not aware of your custom scopes and authorities. So a token exchange from your custom token to a SAP IoT token is required. But no worry, this exchange is handled by the SDK itself! But it requires also some more information to do so:
- SAP IoT service binding (by default service or user provided service)
- UAA service binding (instance which granted the token)

In a local setup you have to add the following information to your existing `default-env.json` file:
```
{
  "VCAP_SERVICES": {
    "iotae": [{ ... }],
    "user-provided": [],
    "xsuaa": [
       {
        "name": "custom-uaa-service",
        "tags": [
          "xsuaa"
        ],
        "credentials": <PASTE XSUAA SERVICE KEY HERE>
      }
    ]
  }
}
```

In a Cloud Foundry setup, just add the XSUAA service name to your application's service dependencies in the `manifest.yml` file:
```
   services:
    - sap-iot-service
    - custom-uaa-service
```

Hint: The implementation of @sap/xssec expects, that an [uaa configuration](https://help.sap.com/viewer/4505d0bdaf4948449b7f7379d24d0f0d/latest/en-US/3bfb120045694e21bfadb1344a693d1f.html) defines at least one role-template to process an successful token exchange.

## FAQ

### How can I call a service which is not covered by this SDK?
The SAP IoT client offers a general `request` function which is also used by the SDK internally. This function gives you full options to access SAP IoT services without caring about authorization (same authorization concept as for all other calls used):

```js
const LeonardoIoT = require('sap-iot-sdk');
const client = new LeonardoIoT();

const url = 'https://tm-data-mapping.cfapps.eu10.hana.ondemand.com/v1/assignments';
const assignments = await client.request({url});
```

There are also multiple ways how to build your custom URL, feel free to choose your prefered one:
```js
// Custom URL with navigator support, most recommended but not available for all services
let url = client.navigator.tmDataMapping() + '/v1/assignments';

// Custom URL with navigator destination offering
let url = client.navigator.getDestination('tm-data-mapping') + '/v1/assignments';

// Custom URL without navigator, least recommended
let url = 'https://tm-data-mapping.cfapps.eu10.hana.ondemand.com/v1/assignments';
```

### How can I add query options to my service call?
Many services offer the option to provide query options i.e. filter, order or top / skip parameters to modify the expected result set. Mostly all parameters are optional, but in case you want to make use of it call the function like shown here:

```js
// read things without query parameters
const things = await client.getThings();

// read things with query parameters
const things = await client.getThings({ '$select': '_id,_name', '$orderby': '_id', '$top': 10 });
```

### How can I make use of user tokens for SAP IoT service calls?
Every service call offers the option to forward authorization credentials by adding it into the request config parameters of the function call. So in case you handle an incoming user request for fetching data from SAP IoT, you can forward the token like this:
```js
// Forward token from incoming request
const things = await client.getThings(null, {'jwt': request.headers.authorization});

// Forward self generated token
const myToken = getToken();
const things = await client.getThings(null, {'jwt': myToken});
```

Please be aware that forwarded tokens have to be exchanged with a SAP IoT valid token. This operation is managed by the SDK itself, but mandatory requires an binding to the XSUAA instance, which granted your user token. For more information please check the [authorization concept documentation](#authorization-concept).

### How can I restrict scopes when calling APIs
There is scope support given on request level to enable request specific scope handling. Therefore you have to handover an Array of scopes to your request call, the SDK will automatically fetch a new token which exactly contains defined scopes (not less, not more).
```js
const things = await client.getThings(null, {'scopes': ["thing!t5*.r"]});
```

### How can I use this SDK for different tenants within a single application?
You can create a SAP IoT client for a specific tenant by providing the name of the user provided service, which contains all tenant related configurations (tenant service key). In case you are testing locally, don't forget to add the user provided service in the `default-env.json` file:
```js
const LeonardoIoT = require('sap-iot-sdk');

// Client using user provided service configuration with name 'dev-tenant'
const clientDevTenant = new LeonardoIoT('dev-tenant');

// Client using user provided service configuration with name 'test-tenant'
const clientTestTenant = new LeonardoIoT('test-tenant');
```

## Contribute to this project
Please check our [Contribution Guidelines](./CONTRIBUTING.md). Your input and support is welcome!

## How to obtain support
Please follow our [Contribution Guidelines](./CONTRIBUTING.md) on how to report an issue.
