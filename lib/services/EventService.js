const querystring = require('querystring');

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
 * Expose functions for most used event APIs
 *
 * @class EventService
 * @author Soeren Buehler
 */
class EventService {
  /**
   * Create an event instance based on a event type
   *
   * @param {object} payload - Request body payload
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/a35c8411e6bd4476a1faa9ba10195d84.html">SAP Help API documentation</a>
   */
  static createEvent(payload, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
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
   *
   * @param {string} eventId - Event identifier
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/aa26025063d3444696160bd67a145ce0.html">SAP Help API documentation</a>
   */
  static getEvent(eventId, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    return this.request({
      url: `${this.navigator.appiotMds()}/Events('${eventId}')`,
      headers,
      resolveWithFullResponse,
      jwt,
      scopes,
    });
  }

  /**
   * Read all events filtered by query parameters
   *
   * @param {object} [queryParameters={}] - Map of query parameters
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/bd98624f54da496ca58ccd8d8262ad44.html">SAP Help API documentation</a>
   */
  static getEvents(queryParameters = {}, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
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
   *
   * @param {string} thingId - Thing identifier
   * @param {object} [queryParameters={}] - Map of query parameters
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/bd98624f54da496ca58ccd8d8262ad44.html">SAP Help API documentation</a>
   */
  static getEventsByThingId(thingId, queryParameters = {}, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
    const enhancedQueryParameters = queryParameters;
    if (queryParameters.$filter) {
      enhancedQueryParameters.$filter += ` and _thingId eq '${thingId}'`;
    } else {
      enhancedQueryParameters.$filter = `_thingId eq '${thingId}'`;
    }

    return this.getEvents(enhancedQueryParameters, {
      headers, resolveWithFullResponse, jwt, scopes,
    });
  }

  /**
   * Delete an event
   *
   * @param {string} eventId - Event identifier
   * @param {RequestConfig} [requestConfig] - Configuration of request metadata parameters
   * @returns {Promise.<*>} API response
   * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/daf7270e43ac41dd975ca76c26f733b0.html">SAP Help API documentation</a>
   */
  static deleteEvent(eventId, {
    headers = {}, resolveWithFullResponse, jwt, scopes,
  } = {}) {
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
