const debug = require('debug')('SAPIoT:Navigator');

/**
 * This class fetches the current landscape information from {ConfigurationProvider}
 * and simplifies the navigation to different service destination URIs.
 *
 * @class Navigator
 * @author Soeren Buehler
 */
class Navigator {
  /**
   * Create class instance
   *
   * @param {object} destinations - Destination collection for micro service endpoints
   */
  constructor(destinations) {
    debug('Creating a new navigator');

    if (!destinations || Object.keys(destinations).length < 1) {
      // eslint-disable-next-line max-len
      throw Error('Incomplete navigator configuration. Ensure a SAP IoT service instance binding or configure authentication options including endpoints via default-env.json file as described in the readme section of used SAP IoT SDK');
    }

    this.destinations = destinations;
  }

  /**
   * Returning landscape specific destination URI for authorization service
   *
   * @returns {string} Service URI
   */
  authorization() {
    return this.destinations.authorization;
  }

  /**
   * Returning landscape specific destination URI for authorization service
   *
   * @returns {string} Service URI
   */
  businessPartner() {
    return this.destinations['business-partner'];
  }

  /**
   * Returning landscape specific destination URI for config-package-sap service
   *
   * @returns {string} Service URI
   */
  configPackage() {
    return this.destinations['config-package-sap'];
  }

  /**
   * Returning landscape specific destination URI for config-thing-sap service
   *
   * @returns {string} Service URI
   */
  configThing() {
    return this.destinations['config-thing-sap'];
  }

  /**
   * Returning landscape specific destination URI for appiot-mds service
   *
   * @returns {string} Service URI
   */
  appiotMds() {
    return this.destinations['appiot-mds'];
  }

  /**
   * Returning landscape specific destination URI for tm-data-mapping service
   *
   * @returns {string} Service URI
   */
  tmDataMapping() {
    return this.destinations['tm-data-mapping'];
  }

  /**
   * Returning landscape specific destination URI for appiot-coldstore service
   *
   * @returns {string} Service URI
   */
  appiotColdstore() {
    return this.destinations['appiot-coldstore'];
  }

  /**
   * Returning landscape specific destination URI for provided service name
   *
   * @param {string} serviceName - Service identifier
   * @throws {Error} Will throw if the destination is unknown for the given servicename
   * @returns {string} Service URI
   */
  getDestination(serviceName) {
    const destination = this.destinations[serviceName];
    if (!destination) throw new Error(`Unknown destination for service name: ${serviceName}`);
    return destination;
  }
}

module.exports = Navigator;
