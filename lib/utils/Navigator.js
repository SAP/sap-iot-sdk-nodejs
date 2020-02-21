const debug = require('debug')('LeonardoIoT:Navigator');

/**
 *  @class Navigator
 *  @author: Soeren Buehler
 * This class fetches the current landscape information from {ConfigurationProvider} and simplifies the navigation to different service destination URIs.
 */
class Navigator {
    /**
     * Create class instance
     * @param {Object} destinations - Destination collection for micro service endpoints
     * @constructor
     */
    constructor(destinations) {
        debug('Creating a new navigator');

        if (!destinations || Object.keys(destinations).length < 1) {
            throw Error('Incomplete navigator configuration. Ensure a Leonardo IoT service instance binding or configure authentication options including endpoints via default-env.json file as described in the readme section of used SAP Leonardo IoT SDK');
        }

        this.destinations = destinations;
    }

    /**
     * Returning landscape specific destination URI for authorization service
     * @returns {String} service URI
     */
    authorization() {
        return this.destinations.authorization;
    }

    /**
     * Returning landscape specific destination URI for authorization service
     * @returns {String} service URI
     */
    businessPartner() {
        return this.destinations['business-partner'];
    }

    /**
     * Returning landscape specific destination URI for config-package-sap service
     * @returns {String} service URI
     */
    configPackage() {
        return this.destinations['config-package-sap'];
    }

    /**
     * Returning landscape specific destination URI for config-thing-sap service
     * @returns {String} service URI
     */
    configThing() {
        return this.destinations['config-thing-sap'];
    }

    /**
     * Returning landscape specific destination URI for appiot-mds service
     * @returns {String} service URI
     */
    appiotMds() {
        return this.destinations['appiot-mds'];
    }

    /**
     * Returning landscape specific destination URI for tm-data-mapping service
     * @returns {String} service URI
     */
    tmDataMapping() {
        return this.destinations['tm-data-mapping'];
    }

    /**
     * Returning landscape specific destination URI for appiot-coldstore service
     * @returns {String} service URI
     */
    appiotColdstore() {
        return this.destinations['appiot-coldstore'];
    }

    /**
     * Returning landscape specific destination URI for provided service name
     * @param {String} serviceName - service identifier
     * @returns {String} service URI
     */
    getDestination(serviceName) {
        const destination = this.destinations[serviceName];
        if (!destination) throw new Error(`Unknown destination for service name: ${serviceName}`);
        return destination;
    }
}

module.exports = Navigator;
