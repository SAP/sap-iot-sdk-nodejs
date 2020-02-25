const assert = require('assert');
const Token = require('../../../lib/auth/Token');

describe('Token', function () {
  describe('getAccessToken', function () {
    it('should return the stored token', function () {
      const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      const token = new Token(jwtToken, 60);
      assert.equal(jwtToken, token.getAccessToken());
    });
  });

  describe('isExpired', function () {
    it('should not be expired', function () {
      const expiresIn = 1000;
      const token = new Token('1', expiresIn);
      assert.equal(false, token.isExpired());
    });

    it('should be expired', function () {
      const expiresIn = -1000;
      const token = new Token('1', expiresIn);
      assert.equal(true, token.isExpired());
    });
  });
});
