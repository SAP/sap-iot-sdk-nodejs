const querystring = require('querystring');

/** @typedef {Object} RequestConfig
 *  @property {Object} [requestConfig.headers] - custom header fields which enrich the request
 *  @property {Boolean} [requestConfig.resolveWithFullResponse=false] - return full or only body part of the response
 *  @property {String} [requestConfig.jwt] - jwt token used in authorization header field
 *  @property {String} [requestConfig.scopes] - Array of scopes requested within token for this request
 */

/**
 *  @class TimeSeriesAggregateStoreService
 *  @author: Soeren Buehler
 *  Expose functions for most used time series aggregate store APIs
 */
class TimeSeriesAggregateStoreService {

  /**
     * Read snapshot data of a thing
     * @param {String} thingId / alternateId - Thing identifier /  Unique thing identifier assigned by the creator of a thing
     * @param {String} [dataCategory='']  - Filter for data category
     * @param {RequestConfig} [requestConfig] - configuration of request metadata parameters
     * @returns {Promise.<*>} API response
     * @see <a href="https://help.sap.com/viewer/fffd6ca18e374c2e80688dab5c31527f/latest/en-US/650d94e61d7c487e9f16052938dabba9.html">SAP Help API documentation</a>
     */
  static getThingSnapshot(thingId, dataCategory = '', { headers = {}, resolveWithFullResponse, jwt, scopes } = {}) {
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
     * @param {String} thingId / alternateId - Thing identifier /  Unique thing identifier assigned by the creator of a thing
     * @param {String} fromTime - Time from which the snapshot details are retrieved for a non-null value of a property. The value for fromTime must correspond to UTC timestamp
     * @param {String} toTime - Time up to which the snapshot details are retrieved for a non-null value of a property. The value for toTime must correspond to UTC timestamp
     * @param {String} [dataCategory='']  - Filter for data category
     * @param {RequestConfig} [requestConfig] - configuration of request metadata parameters
     * @returns {Promise.<*>} API response
     * @see <a href="https://help.sap.com/viewer/fffd6ca18e374c2e80688dab5c31527f/latest/en-US/f98af10173d64b7ebc4befcede262e3e.html">SAP Help API documentation</a>
     */
  static getThingSnapshotWithinTimeRange(thingId, fromTime, toTime, dataCategory = '', { headers = {}, resolveWithFullResponse, jwt, scopes } = {}) {
    return this.request({
      url: `${this.navigator.appiotMds()}/v2/Snapshot(thingId='${thingId}',fromTime='${fromTime}',toTime='${toTime}',dataCategory='${dataCategory}')`,
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Recalculate Aggregates for Time Series Data
   * @param {String} thingId / alternateId - Thing identifier /  Unique thing identifier assigned by the creator of a thing
   * @param {String} thingTypeName - Thing type name
   * @param {String} propertySetId - Property set identifier
   * @param {String} fromTime - Time from which the snapshot details are retrieved for a non-null value of a property. The value for fromTime must correspond to UTC timestamp
   * @param {String} toTime - Time up to which the snapshot details are retrieved for a non-null value of a property. The value for toTime must correspond to UTC timestamp
   * @param {RequestConfig} [requestConfig] - configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/fffd6ca18e374c2e80688dab5c31527f/latest/en-US/44cbb7d0ca0e4655a0ca798911d802f8.html">SAP Help API documentation</a>
   */
  static async recalculateAggregates(thingId, thingTypeName, propertySetId, fromTime, toTime, { headers = {}, resolveWithFullResponse, jwt, scopes } = {}) {
    const queryString = querystring.stringify({
      timerange: fromTime + "-" + toTime
    });

    return this.request({
      method: 'POST',
      url: `${this.navigator.appiotMds()}/Things('${thingId}')/${thingTypeName}/${propertySetId}/RecalculateAggregate?${queryString}`,
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }
}

module.exports = TimeSeriesAggregateStoreService;
