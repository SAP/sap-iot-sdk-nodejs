const os = require('os');
const crypto = require('crypto');
const requestHelper = require('./requestHelper');

class DataHelper {
  static async init(client) {
    DataHelper.runId = crypto.randomBytes(3).toString('hex');
    DataHelper.client = client;
    DataHelper.tenantPrefix = await requestHelper.determineTenantPrefix(client);
    DataHelper.rootObjectGroup = await client.getRootObjectGroup();
    DataHelper.data = {};
  }

  static _getVersioningSuffix(delimiter = '.') {
    const nodeVersion = process.versions.node.replace(/[\W_]+/g, '').substring(0, 6);
    return `${os.platform()}${delimiter}v${nodeVersion}${delimiter}${DataHelper.runId}`;
  }

  static _getPackageName() {
    return `${DataHelper.tenantPrefix}.sdk.${DataHelper._getVersioningSuffix('.')}`;
  }

  static package() {
    return {
      Name: DataHelper._getPackageName(),
      Scope: 'private',
    };
  }

  static propertySetType() {
    return {
      Name: `${DataHelper.package().Name}:TestPropertySetTypeSDK`,
      DataCategory: 'TimeSeriesData',
      Properties: [{ Name: 'Temperature', Type: 'Numeric' }],
    };
  }

  static thingType() {
    return {
      Name: `${DataHelper.package().Name}:TestThingTypeSDK`,
      PropertySets: [
        { Name: 'TestPropertySet', PropertySetType: `${DataHelper.package().Name}:TestPropertySetTypeSDK` },
      ],
    };
  }

  static objectGroup() {
    const objectGroupName = `TestObjectGroupSDK_${DataHelper._getVersioningSuffix('_')}`;
    return {
      name: objectGroupName,
      objectGroupParentID: DataHelper.rootObjectGroup.objectGroupID,
    };
  }

  static thing() {
    return {
      _name: 'TestThingSDK',
      _alternateId: `ThingSDK_${DataHelper._getVersioningSuffix('_')}`,
      _description: { en: 'TestThingSDK' },
      _thingType: [DataHelper.thingType().Name],
      _objectGroup: DataHelper.rootObjectGroup.objectGroupID,
    };
  }

  static event() {
    return {
      _businessTimeStamp: new Date().toISOString(),
      _status: 'Open',
      _code: 'T1',
      _thingId: DataHelper.data.thing._id,
      _severity: 2,
      _description: 'SDK Event',
    };
  }
}

module.exports = DataHelper;
