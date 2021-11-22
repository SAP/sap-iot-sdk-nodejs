const rp = require('request-promise-native');
const debug = require('debug')('LeonardoIoT');
const packageJson = require('../package.json');
const Authenticator = require('./auth/Authenticator');
const PackageService = require('./services/PackageService');
const PropertySetTypeService = require('./services/PropertySetTypeService');
const ThingTypeService = require('./services/ThingTypeService');
const AuthorizationService = require('./services/AuthorizationService');
const ThingService = require('./services/ThingService');
const TimeSeriesStoreService = require('./services/TimeSeriesStoreService');
const TimeSeriesColdStoreService = require('./services/TimeSeriesColdStoreService');
const TimeSeriesAggregateStoreService = require('./services/TimeSeriesAggregateStoreService');
const Navigator = require('./utils/Navigator');
const ConfigurationProvider = require('./utils/ConfigurationProvider');

/**
 * Class acting as a SAP Leonardo IoT client
 *
 * @class LeonardoIoT
 * @property {ThingService} thing - Service for thing related API calls
 * @property {AuthorizationService} authorization - Service for authorization related API calls
 * @property {TimeSeriesStoreService} timeSeriesStore - Service for time series store related API calls
 */
class LeonardoIoT {
  /**
   * Creates a SAP Leonardo IoT client
   *
   * @param {string|object} [configuration] - Either name of service which contains your SAP Leonardo IoT service key or authentication and endpoint configuration
   * @param {object} [configuration.uaa] - Tenant access credentials containing client ID, client secret and authentication URL
   * @param {object} [configuration.endpoints] - Service API endpoint map
   * @param {object} [configuration.xsuaa] - Configuration of custom XSUAA instance used for token exchange
   * @returns {LeonardoIoT} Instance of the SAP IoT SDK
   */
  constructor(configuration) {
    if (configuration && configuration.uaa && configuration.endpoints) {
      this.authenticator = new Authenticator(configuration.uaa, configuration.xsuaa);
      this.navigator = new Navigator(configuration.endpoints);
    } else {
      this.authenticator = new Authenticator(
        ConfigurationProvider.getCredentials(configuration),
        ConfigurationProvider.getXsuaaService(),
      );
      this.navigator = new Navigator(ConfigurationProvider.getDestinations(configuration));
    }
  }

  /**
   * Sends a http request to SAP Leonardo IoT
   *
   * @param {object} requestConfig - The request configuration
   * @param {string} requestConfig.url - The url / resource path of the request
   * @param {string} [requestConfig.method='GET'] - The http method of the request
   * @param {object} [requestConfig.headers] - The headers of the request
   * @param {object} [requestConfig.body] - The JSON body of the request.
   * @param {boolean} [requestConfig.resolveWithFullResponse=false] - If set to `true`, the full response is returned (not just the response body).
   * @param {string} [requestConfig.jwt] - Access token used in authorization header field
   * @param {string} [requestConfig.scopes] - Scopes requested within token for this request
   * @param {object} [requestConfig.agentOptions] - Configuration for the request library. Will be passed directly to the library.
   * @param {object } requestConfig.qs - Map of request params
   * @returns {object} The response.
   */
  async request({
    url, method = 'GET', headers = {}, body = {}, qs = {},
    agentOptions = {}, resolveWithFullResponse = false, jwt, scopes,
  } = {}) {
    const token = await this._manageJWTAuthorization(jwt, scopes);
    const enhancedHeaders = LeonardoIoT._addUserAgent(headers);
    enhancedHeaders.Authorization = `Bearer ${token}`;
    return LeonardoIoT._request({
      url,
      method,
      qs,
      headers: enhancedHeaders,
      body,
      agentOptions,
      resolveWithFullResponse,
      json: true,
    });
  }

  /**
   * Evaluate access token if existing. Else a new one will be fetched.
   *
   * @param {string} accessToken - Forwarded access token
   * @param {string[]} scopes - List of scopes that should be fetched for the token
   * @returns {Promise.<*>} Accesstoken
   * @private
   */
  async _manageJWTAuthorization(accessToken = null, scopes = []) {
    if (accessToken) {
      debug('Using given access token for authorization');
      const token = accessToken.startsWith('Bearer')
        || accessToken.startsWith('bearer') ? accessToken.slice(6, accessToken.length).trim() : accessToken;
      return this.authenticator.exchangeToken(token);
    }
    debug('Fetching access token from authenticator');
    const newToken = await this.authenticator.getToken(scopes);
    return newToken.getAccessToken();
  }

  static _addUserAgent(headers) {
    const enhancedHeaders = headers;
    enhancedHeaders['User-Agent'] = `${packageJson.name}-nodejs / ${packageJson.version}`;
    return enhancedHeaders;
  }

  /**
   * Forward request to backend
   *
   * @param {object} requestConfig - The request configuration
   * @throws {Error} Will throw if an error if the url argument is empty
   * @returns {Promise.<*>} Request result promise
   * @private
   */
  static async _request(requestConfig) {
    if (!requestConfig.url) {
      throw new Error('URL argument is empty for "request" call in SAP IoT');
    }
    debug(`Sending a ${requestConfig.method} request to ${requestConfig.url}`);
    return rp(requestConfig);
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
LeonardoIoT.prototype.deleteTimeSeriesData = TimeSeriesStoreService.deleteTimeSeriesData;

// Time Series Cold Store
LeonardoIoT.prototype.createColdStoreTimeSeriesData = TimeSeriesColdStoreService.createColdStoreTimeSeriesData;
LeonardoIoT.prototype.getColdStoreTimeSeriesData = TimeSeriesColdStoreService.getColdStoreTimeSeriesData;
LeonardoIoT.prototype.deleteColdStoreTimeSeriesData = TimeSeriesColdStoreService.deleteColdStoreTimeSeriesData;

// Time Series Aggregate Store
LeonardoIoT.prototype.getThingSnapshot = TimeSeriesAggregateStoreService.getThingSnapshot;
LeonardoIoT.prototype.getThingSnapshotWithinTimeRange = TimeSeriesAggregateStoreService.getThingSnapshotWithinTimeRange;
LeonardoIoT.prototype.recalculateAggregates = TimeSeriesAggregateStoreService.recalculateAggregates;

module.exports = LeonardoIoT;
