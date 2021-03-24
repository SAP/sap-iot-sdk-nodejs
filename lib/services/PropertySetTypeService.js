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
 * Expose functions for most used property set type APIs
 *
 * @class PropertySetTypeService
 * @author Soeren Buehler
 */
class PropertySetTypeService {
  /**
   * Create a property set type
   *
   * @param {string} packageName - Package identifier
   * @param {object} payload - Request body payload
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/7e40790cad924439be08981c745f615b.html">SAP Help API documentation</a>
   */
  static createPropertySetType(packageName, payload, {
    headers = {}, resolveWithFullResponse = false, jwt, scopes,
  } = {}) {
    return this.request({
      url: `${this.navigator.configThing()}/ThingConfiguration/v1/Packages('${packageName}')/PropertySetTypes`,
      method: 'POST',
      headers,
      body: payload,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Read a property set type
   *
   * @param {string} propertySetTypeName - Property set type identifier
   * @param {object} [queryParameters] - Map of query parameters
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/28da5cd388cf4ed587c4cc4c7cc72e79.html">SAP Help API documentation</a>
   */
  static getPropertySetType(propertySetTypeName, queryParameters, {
    headers = {}, resolveWithFullResponse = false, jwt, scopes,
  } = {}) {
    return this.request({
      url: `${this.navigator.configThing()}/ThingConfiguration/v1/PropertySetTypes('${propertySetTypeName}')`,
      qs: queryParameters,
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Read all property set types filtered by query parameters
   *
   * @param {object} [queryParameters] - Map of query parameters
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/c5d84a80d41c4a3faa960e252ad62a62.html">SAP Help API documentation</a>
   */
  static getPropertySetTypes(queryParameters, {
    headers = {}, resolveWithFullResponse = false, jwt, scopes,
  } = {}) {
    return this.request({
      url: `${this.navigator.configThing()}/ThingConfiguration/v1/PropertySetTypes`,
      qs: queryParameters,
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Read all property set types for a package
   *
   * @param {string} packageName - Package identifier
   * @param {object} [queryParameters] - Map of query parameters
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} Resulting Propertysettypes
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/134ada8a73714e89a2f15877730b527a.html">SAP Help API documentation</a>
   */
  static getPropertySetTypesByPackage(packageName, queryParameters, {
    headers = {}, resolveWithFullResponse = false, jwt, scopes,
  } = {}) {
    return this.request({
      url: `${this.navigator.configThing()}/ThingConfiguration/v1/Packages('${packageName}')/PropertySetTypes`,
      qs: queryParameters,
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   *
   * @param {string} propertySetTypeName - Property set type identifier
   * @param {string} etag - Latest entity tag
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/c6db6b10f3494380bf25d2fd3376c43d.html">SAP Help API documentation</a>
   */
  static deletePropertySetType(propertySetTypeName, etag, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    const enhancedHeaders = headers;
    enhancedHeaders['If-Match'] = etag;
    return this.request({
      url: `${this.navigator.configThing()}/ThingConfiguration/v1/PropertySetTypes('${propertySetTypeName}')`,
      method: 'DELETE',
      headers: enhancedHeaders,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }
}

module.exports = PropertySetTypeService;
