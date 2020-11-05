const assert = require('assert');
const LeonardoIoT = require('../../lib/LeonardoIoT');
const DataHelper = require('./helper/DataHelper');
const xsenv = require('@sap/xsenv');

describe('4) SCOPE', function () {
  let client;

  before(function () {
    if (!process.env.SCOPE) {
      xsenv.loadEnv();
      if (!process.env.SCOPE) throw new Error('Runtime environment configuration (SCOPE in default-env.json file) missing');
    }
    client = new LeonardoIoT({ 
      scope: process.env.SCOPE,
    });
  });

  it('read thing', function () {
    return client.getThing(DataHelper.data.thing._id);
  });

  it('read object group', async function () {
    let og;
    try {
      og = await client.getObjectGroup(DataHelper.data.objectGroup.objectGroupID);
      console.log(og);
    } catch(error) {
      //should throw an error as scope is missing
    }
    if(og){
      assert.fail("Error: Could read Object Group, but Scope should be missing");
    }
  });
});