const axios = require('axios');
const debug = require('debug')('LeonardoIoT');
const packageJson = require('../package.json');
const Authenticator = require('./auth/Authenticator');
const PackageService = require('./services/PackageService');
const PropertySetTypeService = require('./services/PropertySetTypeService');
const ThingTypeService = require('./services/ThingTypeService');
const AuthorizationService = require('./services/AuthorizationService');
const ThingService = require('./services/ThingService');
const EventService = require('./services/EventService');
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
     * @param {String} [configuration] - name of service which contains your SAP Leonardo IoT service key
     * @param {Object} [configuration] - authentication and endpoint configuration
     * @property {Object} [configuration.uaa] - tenant access credentials containing client ID, client secret and authentication URL
     * @property {Object} [configuration.endpoints] - service API endpoint map
     * @property {Object} [configuration.xsuaa] - configuration of custom XSUAA instance used for token exchange
     * @returns {LeonardoIoT}
     */
    constructor(configuration) {
        if (configuration && configuration.uaa && configuration.endpoints) {
            this.authenticator = new Authenticator(configuration.uaa, configuration.xsuaa);
            this.navigator = new Navigator(configuration.endpoints);
        } else {
            this.authenticator = new Authenticator(ConfigurationProvider.getCredentials(configuration), ConfigurationProvider.getXsuaaService());
            this.navigator = new Navigator(ConfigurationProvider.getDestinations(configuration));
        }
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
    async request({ url, method = 'GET', headers = {}, body = {}, resolveWithFullResponse = false, jwt, ...params }) {
        const token = await this._manageJWTAuthorization(jwt);
        const enhancedHeaders = LeonardoIoT._addUserAgent(headers);
        enhancedHeaders.Authorization = `Bearer ${token}`;
        return LeonardoIoT._request({
            url,
            method,
            headers: enhancedHeaders,
            data: body,
            ...params
        }, resolveWithFullResponse);
    }

    /**
     * Evaluate access token if existing. Else a new one will be fetched.
     * @param {String} [accessToken] - forwarded access token
     * @returns {Promise.<*>}
     * @private
     */
    _manageJWTAuthorization(accessToken) {
        if (accessToken) {
            debug('Using given access token for authorization');
            const token = accessToken.startsWith('Bearer') || accessToken.startsWith('bearer') ? accessToken.slice(6, accessToken.length).trim() : accessToken;
            return this.authenticator.exchangeToken(token);
        }
        debug('Fetching access token from authenticator');
        return this.authenticator.getAccessToken();
    }

    static _addUserAgent(headers) {
        const enhancedHeaders = headers;
        enhancedHeaders['User-Agent'] = `${packageJson.name}-nodejs / ${packageJson.version}`;
        return enhancedHeaders;
    }

    /**
     * Forward request to backend
     * @param {Object} requestConfig - The request configuration
     * @returns {Promise.<*>}
     * @private
     */
    static _request(requestConfig, resolveWithFullResponse) {
        if (!requestConfig.url) {
            throw new Error('URL argument is empty for "request" call in Leonardo IoT');
        }

        debug(`Sending a ${requestConfig.method} request to ${requestConfig.url}`);
        let result = axios(requestConfig);
        if (!resolveWithFullResponse) {
            result = result.then((response) => {
                return response.data;
            });
        }
        return result;
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

// Event
LeonardoIoT.prototype.createEvent = EventService.createEvent;
LeonardoIoT.prototype.getEvent = EventService.getEvent;
LeonardoIoT.prototype.getEvents = EventService.getEvents;
LeonardoIoT.prototype.getEventsByThingId = EventService.getEventsByThingId;
LeonardoIoT.prototype.deleteEvent = EventService.deleteEvent;

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
