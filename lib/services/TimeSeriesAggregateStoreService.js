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
 * Expose functions for most used time series aggregate store APIs
 *
 * @class TimeSeriesAggregateStoreService
 * @author Soeren Buehler
 */
class TimeSeriesAggregateStoreService {
  /**
   * Read snapshot data of a thing
   *
   * @param {string} thingId - Thing identifier / Unique thing identifier assigned by the creator of a thing (alternateId)
   * @param {string} [dataCategory='']  - Filter for data category
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/fffd6ca18e374c2e80688dab5c31527f/latest/en-US/650d94e61d7c487e9f16052938dabba9.html">SAP Help API documentation</a>
   */
  static getThingSnapshot(thingId, dataCategory = '', {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    return this.request({
      url: `${this.navigator.appiotMds()}/Snapshot(thingId='${thingId}',fromTime='',dataCategory='${dataCategory}')`,
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Read snapshot data within a time range for a thing
   *
   * @param {string} thingId - Thing identifier / Unique thing identifier assigned by the creator of a thing (alternateId)
   * @param {string} fromTime - Time from which the snapshot details are retrieved for a non-null value of a property. The value for fromTime must correspond to UTC timestamp
   * @param {string} toTime - Time up to which the snapshot details are retrieved for a non-null value of a property. The value for toTime must correspond to UTC timestamp
   * @param {string} [dataCategory='']  - Filter for data category
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/fffd6ca18e374c2e80688dab5c31527f/latest/en-US/f98af10173d64b7ebc4befcede262e3e.html">SAP Help API documentation</a>
   */
  static getThingSnapshotWithinTimeRange(thingId, fromTime, toTime, dataCategory = '', {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    // eslint-disable-next-line max-len
    const path = `/v2/Snapshot(thingId='${thingId}',fromTime='${fromTime}',toTime='${toTime}',dataCategory='${dataCategory}')`;
    return this.request({
      url: `${this.navigator.appiotMds()}${path}`,
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Recalculate Aggregates for Time Series Data
   *
   * @param {string} thingId - Thing identifier / Unique thing identifier assigned by the creator of a thing (alternateId)
   * @param {string} thingTypeName - Thing type name
   * @param {string} propertySetId - Property set identifier
   * @param {string} fromTime - Time from which the snapshot details are retrieved for a non-null value of a property. The value for fromTime must correspond to UTC timestamp
   * @param {string} toTime - Time up to which the snapshot details are retrieved for a non-null value of a property. The value for toTime must correspond to UTC timestamp
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/fffd6ca18e374c2e80688dab5c31527f/latest/en-US/44cbb7d0ca0e4655a0ca798911d802f8.html">SAP Help API documentation</a>
   */
  static async recalculateAggregates(thingId, thingTypeName, propertySetId, fromTime, toTime, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    const queryParameters = {
      timerange: `${fromTime}-${toTime}`,
    };
    return this.request({
      method: 'POST',
      url: `${this.navigator.appiotMds()}/Things('${thingId}')/${thingTypeName}/${propertySetId}/RecalculateAggregate`,
      qs: queryParameters,
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }
}

module.exports = TimeSeriesAggregateStoreService;
