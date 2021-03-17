const debug = require('debug')('SAPIoT:Token');
const jwt = require('jwt-simple');

/**
 * Class representing a JWT token
 *
 * @class Authenticator
 * @author Lukas Brinkmann, Jan Reichert, Soeren Buehler
 */
class Token {
  /**
   * Create a Token
   *
   * @param {string} accessToken - The JWT token.
   * @param {number} expiresIn - The number of seconds in which the token expires.
   */
  constructor(accessToken, expiresIn) {
    debug('Creating a new Token');
    this.accessToken = accessToken;
    this.decodedToken = jwt.decode(accessToken, '', true);
    const currentTime = new Date().getTime() / 1000; // current time since 1.1.1970 in seconds
    this.expiresAt = currentTime + expiresIn;
  }

  /**
   * Get the JWT token.
   *
   * @returns {string} The JWT token.
   */
  getAccessToken() {
    debug('Getting AccessToken from token');
    return this.accessToken;
  }

  /**
   * Get array of token scopes
   *
   * @returns {string[]} List of token scopes
   */
  getScopes() {
    debug('Getting Scopes from token');
    let tokenScopes = [];
    if (this.decodedToken.scope) {
      tokenScopes = this.decodedToken.scope;
    }
    return tokenScopes;
  }

  /**
   * Indicates if the token is expired.
   *
   * @returns {boolean} True, if the stored token is expired
   */
  isExpired() {
    debug('Checking the stored token regarding expiration');
    const currentTime = new Date().getTime() / 1000; // current time since 1.1.1970 in seconds
    return this.expiresAt < currentTime;
  }
}

module.exports = Token;
