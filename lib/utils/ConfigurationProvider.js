const debug = require('debug')('SAPIoT:ConfigurationProvider');
const xsenv = require('@sap/xsenv');

/**
 * This class identifies and provides different configurations i.e. for authentication from local or server environment
 *
 * @class ConfigurationProvider
 * @author Soeren Buehler
 */
class ConfigurationProvider {
  /**
   * Fetching credentials for authentication in the following order
   * 1) Fetch credentials from user provided service
   * 2) Fetch credentials from service binding of SAP IoT service
   * 3) Fetch credentials from local default-env.json file
   * 4) Fetch credentials from environment variables
   * This method is not throwing any error in case no credentials have been found as this library can also be used in a mode in which all access tokens are handled manually
   *
   * @param {string} [serviceName] - Name of service which is providing tenant information
   * @returns {{uaaUrl, clientId, clientSecret}|undefined} Xsuaa configuration from SAP IoT instance if it can be found. Otherwise returns undefined.
   */
  static getCredentials(serviceName) {
    debug('Fetching authentication options');
    const sapIoTService = this._getSAPIoTService(serviceName);
    if (sapIoTService && sapIoTService.credentials) {
      return sapIoTService.credentials.uaa;
    }
    return undefined;
  }

  /**
   * Creating a repository of service destination URLs considering the current landscape. Landscape information is fetched in the following order
   * 1) Fetch landscape information from service binding of SAP IoT service
   * 2) Fetch landscape information from local default-env.json file
   * 3) Fetch landscape information from environment variables
   *
   * In case no landscape information can be determined the default landscape is EU10.
   * This method returns a key value map where key equals the service name (i.e. appiot-mds) and value equals the full destination URI (i.e. https://appiot-mds.cfapps.eu10.hana.ondemand.com)
   *
   * @param {string} [serviceName] - Name of service which is providing tenant information
   * @returns {*} List of endpoints from SAP IoT
   */
  static getDestinations(serviceName) {
    debug('Fetching destinations options from service binding');
    const sapIoTService = this._getSAPIoTService(serviceName);
    if (sapIoTService && sapIoTService.credentials) {
      return sapIoTService.credentials.endpoints;
    }
    return undefined;
  }

  /**
   * Return service object of bound SAP IoT service instance if available
   *
   * @param {string} [serviceName] - Name of service which is providing tenant information
   * @returns {*} SAP IoT servie object from environment
   * @private
   */
  static _getSAPIoTService(serviceName) {
    if (serviceName) {
      return this._getService({ name: serviceName });
    }
    return this._getService({ tag: 'leonardoiot' });
  }

  /**
   * Return service object of bound XSUAA service instance if available
   *
   * @returns {*} Xsuaa service object from environment
   */
  static getXsuaaService() {
    return this._getService({ tag: 'xsuaa' });
  }

  /**
   * Return service object which fits query parameters
   *
   * @param {object} [configuration] - Service configuration query parameters for filtering
   * @param {string} [configuration.name] - Filters service by name, selection parameter with highest priority
   * @param {string} [configuration.tag] - Filters service by tag, selection parameter with lower priority than name
   * @throws {Error} Throws Error if runtime environment configuration cant be loaded
   * @returns {object} Matching service object from environment
   * @private
   */
  static _getService({ name, tag } = {}) {
    if (!process.env.VCAP_SERVICES) {
      xsenv.loadEnv();
      if (!process.env.VCAP_SERVICES) {
        throw new Error('Runtime environment configuration (default-env.json file) missing');
      }
    }

    const services = xsenv.readCFServices();
    let result;
    if (name) {
      result = Object.values(services).find((service) => service && service.name && service.name === name);
    }
    if (tag && !result) {
      result = Object.values(services).find((service) => service && service.tags && service.tags.includes(tag));
    }
    return result;
  }
}

module.exports = ConfigurationProvider;
