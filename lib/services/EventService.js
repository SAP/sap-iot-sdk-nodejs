const querystring = require('querystring');

/** @typedef {Object} RequestConfig
 *  @property {Object} [requestConfig.headers] - custom header fields which enrich the request
 *  @property {Boolean} [requestConfig.resolveWithFullResponse=false] - return full or only body part of the response
 *  @property {String} [requestConfig.jwt] - jwt token used in authorization header field
 *  @property {String} [requestConfig.scopes] - Array of scopes requested within token for this request
 */

/**
 *  @class EventService
 *  @author: Soeren Buehler
 *  Expose functions for most used event APIs
 */
class EventService {
  /**
     * Create an event instance based on a event type
     * @param {Object} payload - request body payload
     * @param {RequestConfig} [requestConfig] - configuration of request metadata parameters
     * @returns {Promise.<*>} API response
     * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/a35c8411e6bd4476a1faa9ba10195d84.html">SAP Help API documentation</a>
     */
  static createEvent(payload, { headers = {}, resolveWithFullResponse, jwt, scopes } = {}) {
    return this.request({
      url: `${this.navigator.appiotMds()}/Events`,
      method: 'POST',
      headers,
      body: payload,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
     * Read an event
     * @param {String} eventId - Event identifier
     * @param {RequestConfig} [requestConfig] - configuration of request metadata parameters
     * @returns {Promise.<*>} API response
     * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/aa26025063d3444696160bd67a145ce0.html">SAP Help API documentation</a>
     */
  static getEvent(eventId, { headers = {}, resolveWithFullResponse, jwt, scopes } = {}) {
    return this.request({
      url: `${this.navigator.appiotMds()}/Events('${eventId}')`,
      headers,
      resolveWithFullResponse,
      jwt,
      scopes
    });
  }

  /**
     * Read all events filtered by query parameters
     * @param {Object} [queryParameters={}] - Map of query parameters
     * @param {RequestConfig} [requestConfig] - configuration of request metadata parameters
     * @returns {Promise.<*>} - API response
     * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/bd98624f54da496ca58ccd8d8262ad44.html">SAP Help API documentation</a>
     */
  static getEvents(queryParameters = {}, { headers = {}, resolveWithFullResponse, jwt, scopes } = {}) {
    const queryString = querystring.stringify(queryParameters);
    const url = `${this.navigator.appiotMds()}/Events${queryString ? `?${queryString}` : ''}`;
    return this.request({
      url,
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
     * Read all events of thing filtered by query parameters
     * @param {String} thingId - Thing identifier
     * @param {Object} [queryParameters={}] - Map of query parameters
     * @param {RequestConfig} [requestConfig] - configuration of request metadata parameters
     * @returns {Promise.<*>} - API response
     * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/bd98624f54da496ca58ccd8d8262ad44.html">SAP Help API documentation</a>
     */
  static getEventsByThingId(thingId, queryParameters = {}, { headers = {}, resolveWithFullResponse, jwt, scopes } = {}) {
    const enhancedQueryParameters = queryParameters;
    if (queryParameters.$filter) {
      enhancedQueryParameters.$filter += ` and _thingId eq '${thingId}'`;
    } else {
      enhancedQueryParameters.$filter = `_thingId eq '${thingId}'`;
    }

    return this.getEvents(enhancedQueryParameters, { headers, resolveWithFullResponse, jwt, scopes });
  }

  /**
     * Delete an event
     * @param {String} eventId - Event identifier
     * @param {RequestConfig} [requestConfig] - configuration of request metadata parameters
     * @returns {Promise.<*>} - API response
     * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/daf7270e43ac41dd975ca76c26f733b0.html">SAP Help API documentation</a>
     */
  static deleteEvent(eventId, { headers = {}, resolveWithFullResponse, jwt, scopes } = {}) {
    return this.request({
      url: `${this.navigator.appiotMds()}/Events('${eventId}')`,
      method: 'DELETE',
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }
}

module.exports = EventService;
