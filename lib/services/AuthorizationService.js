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
 * Expose functions for most used authorization APIs
 *
 * @class AuthorizationService
 * @author Soeren Buehler
 */
class AuthorizationService {
  /**
   * Create an object group
   *
   * @param {object} payload - Request body payload
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/e92728c05dc845f2b1c924144d99fafa.html">SAP Help API documentation</a>
   */
  static createObjectGroup(payload, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    return this.request({
      url: `${this.navigator.authorization()}/ObjectGroups`,
      method: 'POST',
      headers,
      body: payload,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Read an object group
   *
   * @param {string} objectGroupId - Object group identifier
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/412d630939394d9e8a7a789e34960a43.html">SAP Help API documentation</a>
   */
  static getObjectGroup(objectGroupId, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    return this.request({
      url: `${this.navigator.authorization()}/ObjectGroups('${objectGroupId}')`,
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Read all object groups filtered by query parameters
   *
   * @param {object} [queryParameters] - Map of query parameters
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/aa8575ed8b7b42cf99b9144be620126a.html">SAP Help API documentation</a>
   */
  static getObjectGroups(queryParameters, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    return this.request({
      url: `${this.navigator.authorization()}/ObjectGroups`,
      qs: queryParameters,
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Read the root object group
   *
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/9764513e0fd540f09108e365d82f947c.html">SAP Help API documentation</a>
   */
  static getRootObjectGroup({
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    return this.request({
      url: `${this.navigator.authorization()}/ObjectGroups/TenantRoot`,
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Delete an object group
   *
   * @param {string} objectGroupId - Object group identifier
   * @param {string} etag - Latest entity tag
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/7981e6ec75554624b2004e82f7ed7add.html">SAP Help API documentation</a>
   */
  static deleteObjectGroup(objectGroupId, etag, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    const enhancedHeaders = headers;
    enhancedHeaders['If-Match'] = etag;
    return this.request({
      url: `${this.navigator.authorization()}/ObjectGroups('${objectGroupId}')`,
      method: 'DELETE',
      headers: enhancedHeaders,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }
}

module.exports = AuthorizationService;
