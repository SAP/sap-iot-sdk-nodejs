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

            const requiredScopes = token.getScopes().slice(0,2);
            const newToken = await client.authenticator.getToken(requiredScopes);
            assert.equal(newToken.getScopes().length, 2);
            for (const scope of requiredScopes) {
                assert(newToken.getScopes().includes(scope))
            }

            const readThingsScopes = token.getScopes().filter(scope => scope.match("thing!t[1-9]*.r"));
            await client.getThings({}, {scopes : readThingsScopes});
        } catch (error) {
            assert.fail(error);
        }
    });
});
