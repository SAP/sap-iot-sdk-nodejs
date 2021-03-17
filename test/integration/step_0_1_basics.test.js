const assert = require('assert');
const LeonardoIoT = require('../../lib/LeonardoIoT');

describe('01) Basics', function () {
  let client;

  before(function () {
    client = new LeonardoIoT();
  });

  it('get token', async function () {
    try {
      const token = await client.authenticator.getToken();
      assert(token.getScopes().length > 0);
    } catch (error) {
      assert.fail(error);
    }
  });

  it('get token with specific scopes', async function () {
    try {
      const token = await client.authenticator.getToken();
      assert(token.getScopes().length > 2);

      const requiredScopes = token.getScopes().slice(0, 2);
      const newToken = await client.authenticator.getToken(requiredScopes);
      assert.strictEqual(newToken.getScopes().length, 2);
      requiredScopes.forEach((scope) => {
        assert(newToken.getScopes().includes(scope));
      });

      const readThingsScopes = token.getScopes().filter((scope) => scope.match('thing!t[1-9]*.r'));
      const response = await client.getThings(null, { resolveWithFullResponse: true, scopes: readThingsScopes });
      assert.strictEqual(response.statusCode, 200);
    } catch (error) {
      assert.fail(error);
    }
  });
});
