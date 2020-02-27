const assert = require('assert');
const querystring = require('querystring');

class AssertionUtil {
  static assertRequestConfig(requestConfig, expectedConfig) {
    const expected = expectedConfig;
    if (!expected.headers) expected.headers = {};

    assert.equal(querystring.unescape(requestConfig.url), expected.url, 'Unexpected Request URL');
    expected.method ? assert.equal(requestConfig.method, expected.method, 'Unexpected method') : assert(!requestConfig.method, 'Unexpected method');
    expected.headers ? assert.deepEqual(requestConfig.headers, expected.headers, 'Unexpected headers') : assert(!requestConfig.headers, 'Unexpected headers');
    expected.body ? assert.deepEqual(requestConfig.body, expected.body, 'Unexpected body') : assert(!requestConfig.body, 'Unexpected body');
    expected.jwt ? assert.equal(requestConfig.jwt, expected.jwt, 'Unexpected jwt token') : assert(!requestConfig.jwt, 'Unexpected jwt token');

    if (expected.json !== undefined) { assert.equal(requestConfig.json, expected.json, 'Unexpected JSON parameter'); }
  }
}

module.exports = AssertionUtil;
