const assert = require('assert');
const proxyquire = require('proxyquire');

let axiosStub = () => Promise.reject();
const LeonardoIoT = proxyquire('../../lib/LeonardoIoT', { 'axios': (requestConfig) => axiosStub(requestConfig) });
const AssertionUtil = require('./AssertionUtil');
const packageJson = require('../../package.json');

const forwardedAccessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiY2lkIjoieHN1YWFDbGllbnRJZCIsInppZCI6ImFkZTU4NmM2LWY1YjEtNGRkYy1hZWNiLWVhZDNjMmU2ZTcyNSIsInNjb3BlIjpbInVhYS51c2VyIl0sIm5hbWUiOiJTQVAgTGVvbmFyZG8gVGVzdDIiLCJpYXQiOjE1MTYyMzkwMjJ9.h-ETrxkX_K2puXZustO8vTD000OvA_HUfcYWOtokMI_trznDhYgFh9uACd2tPPbKbsrKKH-bcQljSH5Nh-l1KsrsMdVKygJ5-Dmv_8Jdqjb7IHsTZSyQ2b0-EcPawcnECd17N9OJJAIVhBDKnW_32eGLv1yd71Z1e4BjIvuUJCClUWO6mFHD7qL4fcL9zb20N25AcEddDbkTgIe0iSWBaO6k1XUne3jcPcgAOGqpH7J04ACxk7366-4wmtDVk00AXOn8MbNeAkI_cOI3nV3V5dxsB6E6eRFJENKX186DNhwHaBzq6h2VKvXKOG_D2THzPRjDMhiEtrAmSQdB15Re_Q';
const generatedAccessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiY2lkIjoieHN1YWFDbGllbnRJZCIsInppZCI6ImFkZTU4NmM2LWY1YjEtNGRkYy1hZWNiLWVhZDNjMmU2ZTcyNSIsInNjb3BlIjpbInVhYS51c2VyIl0sIm5hbWUiOiJTQVAgTGVvbmFyZG8gVGVzdDEiLCJpYXQiOjE1MTYyMzkwMjJ9.vnel93jRc4Xg43Kl0t8ysmo4VA2SJ0LdSO7HzCDWAwpy91fS0YcaHkFNFKTNqzEXvveaOOPplY7ULaPy2gAQLIMg_sOKrJGaGjQ3oaxTiq5NyHVxBTP7n8DEvt3kmZv8v6GvIOF4vKl4aHU0pZUGlBFNiBRCAr38sSW2A6AMd2X4Ws7bphFCzlMODPayrdolGEvz866sLa8uK4386SYBrjBRQ9K290icPMNyO0fKNS0qNENjRgazAbgAm7PDNO6j7PUhJgN2apKxsQelrysIrRLIfBDTD7TJsOPzgKU3T8FyOOw1XJBonFMSQ9yCHMFKO3KrL1BuzDdtNZMdxvNFfg';

describe('LeonardoIoT', function () {
    let client;
    let tmpVcapServices;

    beforeEach(function () {
        client = new LeonardoIoT();
        tmpVcapServices = JSON.parse(JSON.stringify(process.env.VCAP_SERVICES));
    });

    afterEach(function () {
        process.env.VCAP_SERVICES = JSON.parse(JSON.stringify(tmpVcapServices));
    });

    describe('constructor', function () {
        it('call without arguments', function () {
            const clientDefault = new LeonardoIoT();
            assert.notEqual(clientDefault, undefined, 'Invalid constructor for LeonardoIoT client');
        });

        it('call with configuration arguments', function () {
            const testClient = new LeonardoIoT({
                uaa: {
                    clientid: 'testId',
                    clientsecret: 'testSecret',
                    url: 'https://test.authentication.eu10.hana.ondemand.com'
                },
                endpoints: {
                    'appiot-mds': 'https://appiot-mds.cfapps.eu10.hana.ondemand.com',
                    'config-thing-sap': 'https://config-thing-sap.cfapps.eu10.hana.ondemand.com'
                }
            });
            assert.notEqual(testClient, undefined, 'Invalid constructor for LeonardoIoT client');
        });

        it('call with configuration arguments including xsuaa config', function () {
            const testClient = new LeonardoIoT({
                uaa: {
                    clientid: 'testId',
                    clientsecret: 'testSecret',
                    url: 'https://test.authentication.eu10.hana.ondemand.com'
                },
                endpoints: {
                    'appiot-mds': 'https://appiot-mds.cfapps.eu10.hana.ondemand.com',
                    'config-thing-sap': 'https://config-thing-sap.cfapps.eu10.hana.ondemand.com'
                }
            });
            assert.notEqual(testClient, undefined, 'Invalid constructor for LeonardoIoT client');
        });

        it('instances for multi tenant mode', function () {
            const clientTest = new LeonardoIoT('leonardo-iot-account-test');
            const clientDev = new LeonardoIoT('leonardo-iot-account-dev');

            assert.notEqual(clientTest.authenticator.authUrl, clientDev.authenticator.authUrl, 'Mismatching client ID of clients');
            assert.notEqual(clientTest.authenticator.clientId, clientDev.authenticator.clientId, 'Mismatching client ID of clients');
            assert.notEqual(clientTest.authenticator.clientSecret, clientDev.authenticator.clientSecret, 'Mismatching client ID of clients');
        });
    });

    describe('Request', function () {
        it('has default parameters', async function () {
            const testHeaders = LeonardoIoT._addUserAgent({});
            testHeaders.Authorization = `Bearer ${forwardedAccessToken}`;
            const dataString = 'pass';
            axiosStub = (requestConfig) => {
                AssertionUtil.assertRequestConfig(requestConfig, {
                    url: 'https://appiot-mds.cfapps.eu10.hana.ondemand.com/Things',
                    method: 'GET',
                    headers: testHeaders
                });
                
                return Promise.resolve({data: dataString});
            };
            client.authenticator.exchangeToken = async function () {
                return forwardedAccessToken;
            };
            try {
                const response = await client.request({
                    url: 'https://appiot-mds.cfapps.eu10.hana.ondemand.com/Things',
                    jwt: forwardedAccessToken
                });
                assert.equal(response, dataString, 'Unexpected response');
            } catch (error) {
                assert.fail(error);
            }
        });

        it('responds based on resolveWithFullResponse', async function () {
            const dataString = 'pass';
            const expectedResponse = {
                data: dataString,
                headers : dataString
            };
            axiosStub = (requestConfig) => {            
                return Promise.resolve(expectedResponse);
            };
            client.authenticator.exchangeToken = async function () {
                return forwardedAccessToken;
            };
            try {
                const response = await client.request({
                    url: 'https://appiot-mds.cfapps.eu10.hana.ondemand.com/Things',
                    resolveWithFullResponse: true,
                    jwt: forwardedAccessToken
                });
                assert.deepStrictEqual(response, expectedResponse, 'Unexpected response');
            } catch (error) {
                assert.fail(error);
            }
        });

        it('has correct version in user agent header field', function () {
            const headers = LeonardoIoT._addUserAgent({});
            assert.equal(headers['User-Agent'], `${packageJson.name}-nodejs / ${packageJson.version}`, 'Unexpected User-Agent header field value');
        });

        it('throws error for missing URL parameter', async function () {
            try {
                await LeonardoIoT._request({ url: null });
                assert.fail('Expected Error was not thrown');
            } catch (err) {
                assert.equal(err.message, 'URL argument is empty for "request" call in Leonardo IoT', 'Unexpected error message');
            }
        });
    });

    describe('JWT token', function () {
        it('gets forwarded correctly', async function () {
            const dataString = 'pass';
            axiosStub = (requestConfig) => {
                const expectedJwt = `Bearer ${forwardedAccessToken}`;
                assert.equal(requestConfig.headers.Authorization, expectedJwt, 'Unexpected JWT token forwarding');
                return Promise.resolve({data: dataString});
            };
            client.authenticator.exchangeToken = async function () {
                return forwardedAccessToken;
            };
            try {
                const response = await client.request({
                    url: 'https://appiot-mds.cfapps.eu10.hana.ondemand.com/Things',
                    jwt: forwardedAccessToken
                });
                assert.equal(response, dataString, 'Unexpected response');
            } catch (error) {
                assert.fail(error);
            }
        });

        it('gets sliced and forwarded correctly', async function () {
            const dataString = 'pass';
            axiosStub = (requestConfig) => {
                const expectedJwt = `Bearer ${forwardedAccessToken}`;
                assert.equal(requestConfig.headers.Authorization, expectedJwt, 'Unexpected JWT token forwarding');
                return Promise.resolve({data: dataString});
            };
            client.authenticator.exchangeToken = async function () {
                return forwardedAccessToken;
            };
            try {
                const response = await client.request({
                    url: 'https://appiot-mds.cfapps.eu10.hana.ondemand.com/Things',
                    jwt: `bearer ${forwardedAccessToken}`
                });
                assert.equal(response, dataString, 'Unexpected response');
            } catch (error) {
                assert.fail(error);
            }
        });

        it('gets fetched from authentication URL for request', async function () {
            const dataString = 'pass';
            axiosStub = (requestConfig) => {
                const expectedJwt = `Bearer ${generatedAccessToken}`;
                assert.equal(requestConfig.headers.Authorization, expectedJwt, 'Unexpected JWT token forwarding');
                return Promise.resolve({data: dataString});
            };
            client.authenticator.getAccessToken = async function () {
                return generatedAccessToken;
            };
            try{
                const response = await client.request({
                    url: 'https://appiot-mds.cfapps.eu10.hana.ondemand.com/Things'
                });
                assert.equal(response, dataString, 'Unexpected response');
            } catch (error) {
                assert.fail(error);
            }
        });
    });
});
