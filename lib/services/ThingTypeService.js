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
 * Expose functions for most used thing type APIs
 *
 * @class ThingTypeService
 * @author Soeren Buehler
 */
class ThingTypeService {
  /**
   * Create a thing type
   *
   * @param {string} packageName - Package identifier / name
   * @param {object} payload - Request body payload
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/15eb5681d78c442a8c274752b6b20011.html">SAP Help API documentation</a>
   */
  static createThingType(packageName, payload, {
    headers = {}, resolveWithFullResponse = false, jwt, scopes,
  } = {}) {
    return this.request({
      url: `${this.navigator.configThing()}/ThingConfiguration/v2/Packages('${packageName}')/ThingTypes`,
      method: 'POST',
      headers,
      body: payload,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Read a thing type
   *
   * @param {string} thingTypeName - Thing type identifier
   * @param {object} [queryParameters] - Map of query parameters
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/affa982fcad54d35a31f6d53a0583bcc.html">SAP Help API documentation</a>
   */
  static getThingType(thingTypeName, queryParameters, {
    headers = {}, resolveWithFullResponse = false, jwt, scopes,
  } = {}) {
    return this.request({
      url: `${this.navigator.configThing()}/ThingConfiguration/v1/ThingTypes('${thingTypeName}')`,
      qs: queryParameters,
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Read all thing types filtered by query parameters
   *
   * @param {object} [queryParameters] - Map of query parameters
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/ecef327f458848b3a136aba3bed17f97.html">SAP Help API documentation</a>
   */
  static getThingTypes(queryParameters, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    return this.request({
      url: `${this.navigator.configThing()}/ThingConfiguration/v1/ThingTypes`,
      qs: queryParameters,
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Read all thing types for a package
   *
   * @param {string} packageName - Package identifier
   * @param {object} [queryParameters] - Map of query parameters
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/37203cc631694b08a592d7a42146d0ac.html">SAP Help API documentation</a>
   */
  static getThingTypesByPackage(packageName, queryParameters, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    return this.request({
      url: `${this.navigator.configThing()}/ThingConfiguration/v1/Packages('${packageName}')/ThingTypes`,
      qs: queryParameters,
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Delete a thing type
   *
   * @param {string} thingTypeName - Thing type identifier
   * @param {string} etag - Latest entity tag
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/277d0e0c5f214b4c823fd3d0e804710c.html">SAP Help API documentation</a>
   */
  static deleteThingType(thingTypeName, etag, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    const enhancedHeaders = headers;
    enhancedHeaders['If-Match'] = etag;
    return this.request({
      url: `${this.navigator.configThing()}/ThingConfiguration/v1/ThingTypes('${thingTypeName}')`,
      method: 'DELETE',
      headers: enhancedHeaders,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }
}

module.exports = ThingTypeService;
