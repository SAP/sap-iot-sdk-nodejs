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
 * Expose functions for most used thing APIs
 *
 * @class ThingService
 * @author Soeren Buehler
 */
class ThingService {
  /**
   * Create an thing instance based on a thing type
   *
   * @param {object} payload - Request body payload
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/9cb0266f70604515af1e0197720c9a2f.html">SAP Help API documentation</a>
   */
  static createThing(payload, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    return this.request({
      url: `${this.navigator.appiotMds()}/Things`,
      method: 'POST',
      headers,
      body: payload,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Read a thing
   *
   * @param {string} thingId - Thing identifier
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/26d8abe9ba2d4c7dbe28828f817f4ddb.html">SAP Help API documentation</a>
   */
  static getThing(thingId, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    return this.request({
      url: `${this.navigator.appiotMds()}/Things('${thingId}')`,
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Read a thing by alternate identifier
   *
   * @param {string} alternateId - Unique thing identifier assigned by the creator of a thing
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/5b7c9c6f818242b6a61c91330f29ee32.html">SAP Help API documentation</a>
   */
  static getThingByAlternateId(alternateId, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    return this.request({
      url: `${this.navigator.appiotMds()}/ThingsByAlternateId('${alternateId}')`,
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Read all things filtered by query parameters
   *
   * @param {object} [queryParameters] - Map of query parameters
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/075566a948d54a9e822f21fea493df8e.html">SAP Help API documentation</a>
   */
  static getThings(queryParameters, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    return this.request({
      url: `${this.navigator.appiotMds()}/Things`,
      qs: queryParameters,
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Read all things of thing type filtered by query parameters
   *
   * @param {string} thingTypeName - Thing type identifier / name
   * @param {object} [queryParameters] - Map of query parameters
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/075566a948d54a9e822f21fea493df8e.html">SAP Help API documentation</a>
   */
  static getThingsByThingType(thingTypeName, queryParameters, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    const enhancedQeryParameters = queryParameters || {};
    if (enhancedQeryParameters.$filter) {
      enhancedQeryParameters.$filter += ` and _thingType eq '${thingTypeName}'`;
    } else {
      enhancedQeryParameters.$filter = `_thingType eq '${thingTypeName}'`;
    }

    return this.getThings(enhancedQeryParameters, {
      headers, resolveWithFullResponse, jwt, scopes,
    });
  }

  /**
   * Delete a thing
   *
   * @param {string} thingId - Thing identifier
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/5902f2914b7548c89d74cc21e7b2fd45.html">SAP Help API documentation</a>
   */
  static deleteThing(thingId, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    return this.request({
      url: `${this.navigator.appiotMds()}/Things('${thingId}')`,
      method: 'DELETE',
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }
}

module.exports = ThingService;
