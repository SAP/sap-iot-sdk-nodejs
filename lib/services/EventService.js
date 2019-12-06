const querystring = require('querystring');

/** @typedef {Object} RequestConfig
 *  @property {Object} [requestConfig.headers] - custom header fields which enrich the request
 *  @property {Boolean} [requestConfig.resolveWithFullResponse=false] - return full or only body part of the response
 *  @property {String} [requestConfig.jwt] - jwt token used in authorization header field
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
  static async createEvent(payload, { headers = {}, resolveWithFullResponse, jwt } = {}) {
    return await this.request({
      url: `${this.navigator.appiotMds()}/Events`,
      method: 'POST',
      headers,
      body: payload,
      resolveWithFullResponse,
      jwt
    });
  }

  /**
     * Read an event
     * @param {String} eventId - Event identifier
     * @param {RequestConfig} [requestConfig] - configuration of request metadata parameters
     * @returns {Promise.<*>} API response
     * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/aa26025063d3444696160bd67a145ce0.html">SAP Help API documentation</a>
     */
  static async getEvent(eventId, { headers = {}, resolveWithFullResponse, jwt } = {}) {
    return await this.request({
      url: `${this.navigator.appiotMds()}/Events('${eventId}')`,
      headers,
      resolveWithFullResponse,
      jwt
    });
  }

  /**
     * Read all events filtered by query parameters
     * @param {Object} [queryParameters={}] - Map of query parameters
     * @param {RequestConfig} [requestConfig] - configuration of request metadata parameters
     * @returns {Promise.<*>} - API response
     * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/bd98624f54da496ca58ccd8d8262ad44.html">SAP Help API documentation</a>
     */
  static async getEvents(queryParameters = {}, { headers = {}, resolveWithFullResponse, jwt } = {}) {
    const queryString = querystring.stringify(queryParameters);
    const url = `${this.navigator.appiotMds()}/Events${queryString ? `?${queryString}` : ''}`;
    return await this.request({
      url,
      headers,
      resolveWithFullResponse,
      jwt
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
  static async getEventsByThingId(thingId, queryParameters = {}, { headers = {}, resolveWithFullResponse, jwt } = {}) {
    if (queryParameters.$filter) {
      queryParameters.$filter += ` and _thingId eq '${thingId}'`;
    } else {
      queryParameters.$filter = `_thingId eq '${thingId}'`;
    }

    return await this.getEvents(queryParameters, { headers, resolveWithFullResponse, jwt });
  }

  /**
     * Delete an event
     * @param {String} eventId - Event identifier
     * @param {RequestConfig} [requestConfig] - configuration of request metadata parameters
     * @returns {Promise.<*>} - API response
     * @see <a href="https://help.sap.com/viewer/080fabc6cae6423fb45fca7752adb61e/latest/en-US/daf7270e43ac41dd975ca76c26f733b0.html">SAP Help API documentation</a>
     */
  static async deleteEvent(eventId, { headers = {}, resolveWithFullResponse, jwt } = {}) {
    return await this.request({
      url: `${this.navigator.appiotMds()}/Events('${eventId}')`,
      method: 'DELETE',
      headers,
      resolveWithFullResponse,
      jwt
    });
  }
}

module.exports = EventService;
