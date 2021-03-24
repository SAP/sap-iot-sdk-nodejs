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
 * Expose functions for most used package APIs
 *
 * @class PackageService
 * @author Soeren Buehler
 */
class PackageService {
  /**
   * Create a package
   *
   * @param {object} payload - Request body payload
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/72815137035e48e0ac38e50934e718df.html">SAP Help API documentation</a>
   */
  static createPackage(payload, {
    headers = {}, resolveWithFullResponse = false, jwt, scopes,
  } = {}) {
    return this.request({
      url: `${this.navigator.configPackage()}/Package/v1/Packages`,
      method: 'POST',
      headers,
      body: payload,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Read a package
   *
   * @param {string} packageName - Package identifier
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/9dca46391c5246f7905663364ad00d1f.html">SAP Help API documentation</a>
   */
  static getPackage(packageName, {
    headers = {}, resolveWithFullResponse = false, jwt, scopes,
  } = {}) {
    return this.request({
      url: `${this.navigator.configPackage()}/Package/v1/Packages('${packageName}')`,
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Read all packages filtered by query parameters
   *
   * @param {object} [queryParameters] - Map of query parameters
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/cc532659dbaf4d2ab0afa86b863e4be6.html">SAP Help API documentation</a>
   */
  static getPackages(queryParameters, {
    headers = {}, resolveWithFullResponse = false, jwt, scopes,
  } = {}) {
    return this.request({
      url: `${this.navigator.configPackage()}/Package/v1/Packages`,
      qs: queryParameters,
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Delete a package
   *
   * @param {string} packageName - Package identifier
   * @param {string} etag - Latest entity tag
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/ba27c0634a3c4208898672e8ac6562e3.html">SAP Help API documentation</a>
   */
  static deletePackage(packageName, etag, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    const enhancedHeaders = headers;
    enhancedHeaders['If-Match'] = etag;
    return this.request({
      url: `${this.navigator.configPackage()}/Package/v1/Packages('${packageName}')`,
      method: 'DELETE',
      headers: enhancedHeaders,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }
}

module.exports = PackageService;
