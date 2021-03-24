const assert = require('assert');
const querystring = require('querystring');

class AssertionUtil {
  static assertRequestConfig(requestConfig, expectedConfig) {
    const expected = expectedConfig;
    if (!expected.headers) expected.headers = {};

    assert.strictEqual(querystring.unescape(requestConfig.url), expected.url, 'Unexpected Request URL');
    // eslint-disable-next-line no-unused-expressions
    expected.method
      ? assert.strictEqual(requestConfig.method, expected.method, 'Unexpected HTTP method')
      : assert(!requestConfig.method, 'Unexpected HTTP method');
    // eslint-disable-next-line no-unused-expressions
    expected.headers
      ? assert.deepStrictEqual(requestConfig.headers, expected.headers, 'Unexpected headers')
      : assert(!requestConfig.headers, 'Unexpected headers');
    // eslint-disable-next-line no-unused-expressions
    expected.qs
      ? assert.deepStrictEqual(requestConfig.qs, expected.qs, 'Unexpected queryParameters')
      : assert(!requestConfig.qs, 'Unexpected queryParameters');
    // eslint-disable-next-line no-unused-expressions
    expected.body
      ? assert.deepStrictEqual(requestConfig.body, expected.body, 'Unexpected body')
      : assert(!requestConfig.body, 'Unexpected body');
    // eslint-disable-next-line no-unused-expressions
    expected.resolveWithFullResponse !== undefined
      ? assert.strictEqual(
        requestConfig.resolveWithFullResponse,
        expected.resolveWithFullResponse,
        'Unexpected response resolve option',
      )
      : assert(!requestConfig.resolveWithFullResponse, 'Unexpected response resolve option');
    // eslint-disable-next-line no-unused-expressions
    expected.jwt
      ? assert.strictEqual(requestConfig.jwt, expected.jwt, 'Unexpected jwt token')
      : assert(!requestConfig.jwt, 'Unexpected jwt token');
    // eslint-disable-next-line no-unused-expressions
    expected.agentOptions
      ? assert.deepStrictEqual(requestConfig.agentOptions, expected.agentOptions, 'Unexpected agent options')
      : assert(!requestConfig.agentOptions, 'Unexpected agent options');

    if (expected.json !== undefined) {
      assert.strictEqual(requestConfig.json, expected.json, 'Unexpected JSON parameter');
    }
  }
}

module.exports = AssertionUtil;
