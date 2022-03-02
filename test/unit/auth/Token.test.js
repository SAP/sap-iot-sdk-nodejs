const assert = require('assert');
const jwt = require('jwt-simple');
const Token = require('../../../lib/auth/Token');

const tokenSecret = 'test';
const sampleToken = { name: 'SAP IoT Token', scope: ['thing.r', 'thing.c'] };

describe('Token', function () {
  describe('getAccessToken', function () {
    it('should return the stored token', function () {
      const jwtToken = jwt.encode(sampleToken, tokenSecret);
      const token = new Token(jwtToken, 60);
      assert.strictEqual(jwtToken, token.getAccessToken());
    });
  });

  describe('getScopes', function () {
    it('should return empty array', function () {
      const nonScopeToken = JSON.parse(JSON.stringify(sampleToken));
      delete nonScopeToken.scope;

      const jwtToken = jwt.encode(nonScopeToken, tokenSecret);
      const token = new Token(jwtToken, 60);
      const scopes = token.getScopes();
      assert(Array.isArray(scopes));
      assert.strictEqual(scopes.length, 0);
    });

    it('should return token scopes', function () {
      const scopes = ['action.r', 'action.c', 'action.d'];
      const scopeToken = JSON.parse(JSON.stringify(sampleToken));
      scopeToken.scope = scopes;

      const jwtToken = jwt.encode(scopeToken, tokenSecret);
      const token = new Token(jwtToken, 60);
      assert.strictEqual(scopes.join(' '), token.getScopes().join(' '));
    });
  });

  describe('isExpired', function () {
    it('should return false if token is not expired', function () {
      const expiresIn = 1000;
      const jwtToken = jwt.encode(sampleToken, tokenSecret);
      const token = new Token(jwtToken, expiresIn);
      assert.strictEqual(token.isExpired(), false);
    });
    it('should return true if token is expired', function () {
      const expiresIn = -1000;
      const jwtToken = jwt.encode(sampleToken, tokenSecret);
      const token = new Token(jwtToken, expiresIn);
      assert.strictEqual(token.isExpired(), true);
    });
  });
});
