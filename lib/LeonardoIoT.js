const rp = require('request-promise-native');
const debug = require('debug')('LeonardoIoT');
const version = require('../package.json').version;
const Authenticator = require('./auth/Authenticator');
const PackageService = require('./services/PackageService');
const PropertySetTypeService = require('./services/PropertySetTypeService');
const ThingTypeService = require('./services/ThingTypeService');
const AuthorizationService = require('./services/AuthorizationService');
const ThingService = require('./services/ThingService');
const TimeSeriesStoreService = require('./services/TimeSeriesStoreService');
const TimeSeriesColdStoreService = require('./services/TimeSeriesColdStoreService');
const Navigator = require('./utils/Navigator');
const ConfigurationProvider = require('./utils/ConfigurationProvider');

/**
 * @class LeonardoIoT
 * Class acting as a SAP Leonardo IoT client
 * @Property {ThingService} this.thing - Service for thing related API calls
 * @Property {ConfigurationService} this.configuration - Service for configuration related API calls
 * @Property {AuthorizationService} this.authorization - Service for authorization related API calls
 * @Property {TimeSeriesStoreService} this.timeSeriesStore - Service for time series store related API calls
 * */
class LeonardoIoT {
    /**
     * Create a SAP Leonardo IoT client
     * @constructor
     * @param {String} [serviceName] - name of service which contains your SAP Leonardo IoT service key
     * @returns {LeonardoIoT}
     */
    constructor(serviceName) {
        this.authenticator = new Authenticator(ConfigurationProvider.getCredentials(serviceName), ConfigurationProvider.getXsuaaService());
        this.navigator = new Navigator(serviceName);
    }

    /**
     * Sends a http request to SAP Leonardo IoT
     * @param {Object} requestConfig - The request configuration
     * @param {string} requestConfig.url - The url / resource path of the request
     * @param {string} [requestConfig.method='GET'] - The http method of the request
     * @param {Object} [requestConfig.headers] - The headers of the request
     * @param {Object} [requestConfig.body] - The JSON body of the request.
     * @param {boolean} [requestConfig.resolveWithFullResponse=false] - If set to `true`, the full response is returned (not just the response body).
     * @param {string} requestConfig.jwt - Access token used in authorization header field
     * @return {object} The response.
     */
    async request({url, method = 'GET', headers = {}, body = {}, agentOptions = {}, resolveWithFullResponse = false, jwt} = {}) {
        jwt = await this._manageJWTAuthorization(jwt);
        headers.Authorization = `Bearer ${jwt}`;
        headers['SAP-SDK-VERSION'] = `LEONARDO-IOT-${version}`;

        return await LeonardoIoT._request({
            url,
            method,
            headers,
            body,
            agentOptions,
            resolveWithFullResponse,
            json: true
        });
    }

    /**
     * Evaluate access token if existing. Else a new one will be fetched.
     * @param {String} [accessToken] - forwarded access token
     * @returns {Promise.<*>}
     * @private
     */
    async _manageJWTAuthorization(accessToken) {
        if (accessToken) {
            debug('Using given access token for authorization');
            accessToken = accessToken.startsWith('Bearer') || accessToken.startsWith('bearer') ? accessToken.slice(6, accessToken.length).trim() : accessToken;
            return await this.authenticator.exchangeToken(accessToken);
        }
        debug('Fetching access token from authenticator');
        return await this.authenticator.getAccessToken();
    }

    /**
     * Forward request to backend
     * @param {Object} requestConfig - The request configuration
     * @returns {Promise.<*>}
     * @private
     */
    static async _request(requestConfig) {
        if (!requestConfig.url) {
            throw new Error('URL argument is empty for "request" call in Leonardo IoT');
        }

        debug(`Sending a ${requestConfig.method} request to ${requestConfig.url}`);
        return await rp(requestConfig);
    }
}

// Package
LeonardoIoT.prototype.createPackage = PackageService.createPackage;
LeonardoIoT.prototype.getPackage = PackageService.getPackage;
LeonardoIoT.prototype.getPackages = PackageService.getPackages;
LeonardoIoT.prototype.deletePackage = PackageService.deletePackage;

// Property Set Type
LeonardoIoT.prototype.createPropertySetType = PropertySetTypeService.createPropertySetType;
LeonardoIoT.prototype.getPropertySetType = PropertySetTypeService.getPropertySetType;
LeonardoIoT.prototype.getPropertySetTypes = PropertySetTypeService.getPropertySetTypes;
LeonardoIoT.prototype.getPropertySetTypesByPackage = PropertySetTypeService.getPropertySetTypesByPackage;
LeonardoIoT.prototype.deletePropertySetType = PropertySetTypeService.deletePropertySetType;

// Thing Type
LeonardoIoT.prototype.createThingType = ThingTypeService.createThingType;
LeonardoIoT.prototype.getThingType = ThingTypeService.getThingType;
LeonardoIoT.prototype.getThingTypes = ThingTypeService.getThingTypes;
LeonardoIoT.prototype.getThingTypesByPackage = ThingTypeService.getThingTypesByPackage;
LeonardoIoT.prototype.deleteThingType = ThingTypeService.deleteThingType;

// Object Group
LeonardoIoT.prototype.createObjectGroup = AuthorizationService.createObjectGroup;
LeonardoIoT.prototype.getObjectGroup = AuthorizationService.getObjectGroup;
LeonardoIoT.prototype.getObjectGroups = AuthorizationService.getObjectGroups;
LeonardoIoT.prototype.getRootObjectGroup = AuthorizationService.getRootObjectGroup;
LeonardoIoT.prototype.deleteObjectGroup = AuthorizationService.deleteObjectGroup;

// Thing
LeonardoIoT.prototype.createThing = ThingService.createThing;
LeonardoIoT.prototype.getThing = ThingService.getThing;
LeonardoIoT.prototype.getThingByAlternateId = ThingService.getThingByAlternateId;
LeonardoIoT.prototype.getThings = ThingService.getThings;
LeonardoIoT.prototype.getThingsByThingType = ThingService.getThingsByThingType;
LeonardoIoT.prototype.deleteThing = ThingService.deleteThing;

// Time Series Store
LeonardoIoT.prototype.createTimeSeriesData = TimeSeriesStoreService.createTimeSeriesData;
LeonardoIoT.prototype.getTimeSeriesData = TimeSeriesStoreService.getTimeSeriesData;
LeonardoIoT.prototype.getThingSnapshot = TimeSeriesStoreService.getThingSnapshot;
LeonardoIoT.prototype.deleteTimeSeriesData = TimeSeriesStoreService.deleteTimeSeriesData;

// Time Series Cold Store
LeonardoIoT.prototype.createColdStoreTimeSeriesData = TimeSeriesColdStoreService.createColdStoreTimeSeriesData;
LeonardoIoT.prototype.getColdStoreTimeSeriesData = TimeSeriesColdStoreService.getColdStoreTimeSeriesData;
LeonardoIoT.prototype.deleteColdStoreTimeSeriesData = TimeSeriesColdStoreService.deleteColdStoreTimeSeriesData;

module.exports = LeonardoIoT;
