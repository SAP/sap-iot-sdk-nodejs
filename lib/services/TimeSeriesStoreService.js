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
 * Expose functions for most used time series store APIs
 *
 * @class TimeSeriesStoreService
 * @author Soeren Buehler
 */
class TimeSeriesStoreService {
  /**
   * Create time series data of a thing within retention period
   *
   * @param {string} thingId - Thing identifier
   * @param {string} thingTypeName - Thing type name
   * @param {string} propertySetId - Property set identifier
   * @param {object} payload - Time series data payload
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/a71c33f350d543429420611b37d74422.html">SAP Help API documentation</a>
   */
  static createTimeSeriesData(thingId, thingTypeName, propertySetId, payload, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    const url = `${this.navigator.appiotMds()}/Things('${thingId}')/${thingTypeName}/${propertySetId}`;
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
   * Read time series data of a thing within retention period
   *
   * @param {string} thingId - Thing identifier
   * @param {string} thingTypeName - Thing type name
   * @param {string} propertySetId - Property set identifier
   * @param {object} [queryParameters] - Map of query parameters
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} Result of service request
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/1aac0e3ce4c3474e912e12c4565d991a.html">SAP Help API documentation</a>
   */
  static getTimeSeriesData(thingId, thingTypeName, propertySetId, queryParameters, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    return this.request({
      url: `${this.navigator.appiotMds()}/Things('${thingId}')/${thingTypeName}/${propertySetId}`,
      qs: queryParameters,
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Delete time series data of a thing within retention period
   *
   * @param {string} thingId - Thing identifier
   * @param {string} thingTypeName - Thing type name
   * @param {string} propertySetId - Property set identifier
   * @param {Date} fromTime - From timestamp in ISO8601 format used for data selection
   * @param {Date} toTime - To timestamp in ISO8601 format used for data selection
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} Result of service request
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/f818538640ae44c786299a4156902176.html">SAP Help API documentation</a>
   */
  static deleteTimeSeriesData(thingId, thingTypeName, propertySetId, fromTime, toTime, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    const queryParameters = {
      timerange: `${fromTime}-${toTime}`,
    };
    return this.request({
      url: `${this.navigator.appiotMds()}/Things('${thingId}')/${thingTypeName}/${propertySetId}`,
      qs: queryParameters,
      method: 'DELETE',
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }
}

module.exports = TimeSeriesStoreService;
