function determineTenantPrefix(client) {
  return client.request({
    url: `${client.navigator.businessPartner()}/Tenants`,
  }).then((response) => response.value[0].package);
}

async function deletePackageCascading(client, packageName) {
  const thingTypes = await client.getThingTypesByPackage(packageName).then((result) => result.d.results);
  const thingTypeDeletePromises = thingTypes.map(async (thingType) => {
    const thingsResponse = await client.getThingsByThingType(thingType.Name).then((result) => result.value);
    const thingDeletePromises = thingsResponse.map(async (thing) => client.deleteThing(thing._id));
    await Promise.all(thingDeletePromises);
    const thingTypeResponse = await client.getThingType(thingType.Name, {}, { resolveWithFullResponse: true });
    return client.deleteThingType(thingType.Name, thingTypeResponse.headers.etag);
  });
  await Promise.all(thingTypeDeletePromises);

  const psts = await client.getPropertySetTypesByPackage(packageName).then((result) => result.d.results);
  psts.sort((a, b) => {
    if (a.DataCategory === 'ReferencePropertyData') {
      return -1;
    }
    return b.DataCategory === 'ReferencePropertyData' ? 1 : 0;
  });
  const pstDeletePromises = psts.map(async (pst) => {
    const pstResponse = await client.getPropertySetType(pst.Name, {}, { resolveWithFullResponse: true });
    return client.deletePropertySetType(pst.Name, pstResponse.headers.etag);
  });
  await Promise.all(pstDeletePromises);
  const packageResponse = await client.getPackage(packageName, { resolveWithFullResponse: true });
  return client.deletePackage(packageName, packageResponse.headers.etag);
}

module.exports = {
  determineTenantPrefix,
  deletePackageCascading,
};
