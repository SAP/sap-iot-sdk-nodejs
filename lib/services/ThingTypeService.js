const querystring = require('querystring');

/** @typedef {Object} RequestConfig
 *  @property {Object} [requestConfig.headers] - custom header fields which enrich the request
 *  @property {Boolean} [requestConfig.resolveWithFullResponse=false] - return full or only body part of the response
 *  @property {String} [requestConfig.jwt] - jwt token used in authorization header field
 *  @property {String} [requestConfig.scopes] - scopes requested within token for this request
 */

/**
 *  @class ThingTypeService
 *  @author: Soeren Buehler
 *  Expose functions for most used thing type APIs
 */
class ThingTypeService {
    /**
     * Create a thing type
     * @param {String} packageName - Package identifier / name
     * @param {Object} payload - request body payload
     * @param {RequestConfig} [requestConfig] - configuration of request metadata parameters
     * @returns {Promise.<*>} API response
     * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/15eb5681d78c442a8c274752b6b20011.html">SAP Help API documentation</a>
     */
    static createThingType(packageName, payload, { headers = {}, resolveWithFullResponse = false, jwt, scopes } = {}) {
        return this.request({
            url: `${this.navigator.configThing()}/ThingConfiguration/v2/Packages('${packageName}')/ThingTypes`,
            method: 'POST',
            headers,
            body: payload,
            resolveWithFullResponse,
            jwt,
            scopes
        });
    }

    /**
     * Read a thing type
     * @param {String} thingTypeName - Thing type identifier
     * @param {Object} [queryParameters={}] - Map of query parameters
     * @param {RequestConfig} [requestConfig] - configuration of request metadata parameters
     * @returns {Promise.<*>} API response
     * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/affa982fcad54d35a31f6d53a0583bcc.html">SAP Help API documentation</a>
     */
    static getThingType(thingTypeName, queryParameters = {}, { headers = {}, resolveWithFullResponse = false, jwt, scopes } = {}) {
        const queryString = querystring.stringify(queryParameters);
        return this.request({
            url: `${this.navigator.configThing()}/ThingConfiguration/v1/ThingTypes('${thingTypeName}')${queryString ? `?${queryString}` : ''}`,
            headers,
            resolveWithFullResponse,
            jwt,
            scopes
        });
    }

    /**
     * Read all thing types filtered by query parameters
     * @param {Object} [queryParameters={}] - Map of query parameters
     * @param {RequestConfig} [requestConfig] - configuration of request metadata parameters
     * @returns {Promise.<*>} API response
     * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/ecef327f458848b3a136aba3bed17f97.html">SAP Help API documentation</a>
     */
    static getThingTypes(queryParameters = {}, { headers = {}, resolveWithFullResponse, jwt, scopes } = {}) {
        const queryString = querystring.stringify(queryParameters);
        return this.request({
            url: `${this.navigator.configThing()}/ThingConfiguration/v1/ThingTypes${queryString ? `?${queryString}` : ''}`,
            headers,
            resolveWithFullResponse,
            jwt,
            scopes
        });
    }

    /**
     * Read all thing types for a package
     * @param {String} packageName - Package identifier
     * @param {Object} [queryParameters={}] - Map of query parameters
     * @param {RequestConfig} [requestConfig] - configuration of request metadata parameters
     * @returns {Promise.<*>} API response
     * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/37203cc631694b08a592d7a42146d0ac.html">SAP Help API documentation</a>
     */
    static getThingTypesByPackage(packageName, queryParameters = {}, { headers = {}, resolveWithFullResponse, jwt, scopes } = {}) {
        const queryString = querystring.stringify(queryParameters);
        return this.request({
            url: `${this.navigator.configThing()}/ThingConfiguration/v1/Packages('${packageName}')/ThingTypes${queryString ? `?${queryString}` : ''}`,
            headers,
            resolveWithFullResponse,
            jwt,
            scopes
        });
    }

    /**
     * Delete a thing type
     * @param {String} thingTypeName - Thing type identifier
     * @param {String} etag - latest entity tag
     * @param {RequestConfig} [requestConfig] - configuration of request metadata parameters
     * @returns {Promise.<*>} API response
     * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/277d0e0c5f214b4c823fd3d0e804710c.html">SAP Help API documentation</a>
     */
    static deleteThingType(thingTypeName, etag, { headers = {}, resolveWithFullResponse, jwt, scopes } = {}) {
        const enhancedHeaders = headers;
        enhancedHeaders['If-Match'] = etag;
        return this.request({
            url: `${this.navigator.configThing()}/ThingConfiguration/v1/ThingTypes('${thingTypeName}')`,
            method: 'DELETE',
            headers: enhancedHeaders,
            resolveWithFullResponse,
            jwt,
            scopes
        });
    }
}

module.exports = ThingTypeService;
