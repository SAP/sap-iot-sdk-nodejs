/**
 * Configuration parameters for the request that will be sent
 *
 * @typedef {object} RequestConfig
 * @property {object} [headers] - Custom header fields which enrich the request
 * @property {boolean} [resolveWithFullResponse=false] - Return full or only body part of the response
 * @property {string} [jwt] - Jwt token used in authorization header field
 * @property {string[]} [scopes] - List of scopes requested within token for this request
 */

/**
 * Expose functions for most used time series cold store APIs
 *
 * @class TimeSeriesColdStoreService
 * @author Soeren Buehler
 */
class TimeSeriesColdStoreService {
  /**
   * Create time series data of a thing beyond retention period
   *
   * @param {string} thingId - Thing identifier
   * @param {string} thingTypeName - Thing type name
   * @param {string} propertySetId - Property set identifier
   * @param {object} payload - Time series data payload
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/e9bde3d929b64c64bacbf7c3fa9b0aef.html">SAP Help API documentation</a>
   */
  static createColdStoreTimeSeriesData(thingId, thingTypeName, propertySetId, payload, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    const url = `${this.navigator.appiotColdstore()}/Things('${thingId}')/${thingTypeName}/${propertySetId}`;
    return this.request({
      url,
      method: 'PUT',
      headers,
      body: payload,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Read time series data of a thing beyond retention period
   *
   * @param {string} thingId - Thing identifier
   * @param {string} thingTypeName - Thing type name
   * @param {string} propertySetId - Property set identifier
   * @param {Date} fromTime - From timestamp in ISO8601 format used for data selection
   * @param {Date} toTime - To timestamp in ISO8601 format used for data selection
   * @param {object} [queryParameters] - Map of query parameters
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} Result of service request
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/0c4cd3c27bbc4e84a49ce4b32e3e3887.html">SAP Help API documentation</a>
   */
  static getColdStoreTimeSeriesData(thingId, thingTypeName, propertySetId, fromTime, toTime, queryParameters, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    const enhancedQueryParameters = queryParameters || {};
    enhancedQueryParameters.timerange = `${fromTime}-${toTime}`;
    return this.request({
      url: `${this.navigator.appiotColdstore()}/Things('${thingId}')/${thingTypeName}/${propertySetId}`,
      qs: enhancedQueryParameters,
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Delete time series data of a thing beyond retention period
   *
   * @param {string} thingId - Thing identifier
   * @param {string} thingTypeName - Thing type name
   * @param {string} propertySetId - Property set identifier
   * @param {Date} fromTime - From timestamp in ISO8601 format used for data selection
   * @param {Date} toTime - To timestamp in ISO8601 format used for data selection
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} Result of service request
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/61a76ced9ce647f88ee24648493aeb9b.html">SAP Help API documentation</a>
   */
  static deleteColdStoreTimeSeriesData(thingId, thingTypeName, propertySetId, fromTime, toTime, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    const queryParameters = {
      timerange: `${fromTime}-${toTime}`,
    };
    return this.request({
      url: `${this.navigator.appiotColdstore()}/Things('${thingId}')/${thingTypeName}/${propertySetId}`,
      qs: queryParameters,
      method: 'DELETE',
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }
}

module.exports = TimeSeriesColdStoreService;
