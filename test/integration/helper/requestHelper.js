function determineTenantPrefix(client) {
  return client.request({
    url: `${client.navigator.businessPartner()}/Tenants`,
  }).then((response) => response.value[0].package);
}

async function deletePackageCascading(client, packageName) {
  const thingTypesResponse = await client.getThingTypesByPackage(packageName);
  const thingTypes = thingTypesResponse.d.results;
  thingTypes.forEach(async (thingType) => {
    const thingTypeResponse = await client.getThingType(thingType.Name, {}, { resolveWithFullResponse: true });
    const thingsResponse = await client.getThingsByThingType(thingType.Name);
    // eslint-disable-next-line no-async-promise-executor
    const thingDeletePromises = thingsResponse.value.map((thing) => new Promise(async (resolve, reject) => {
      try {
        const events = await client.getEventsByThingId(thing._id);
        const eventDeletePromises = events.value.map((event) => client.deleteEvent(event._id));
        await Promise.all(eventDeletePromises);
        await client.deleteThing(thing._id);
        resolve();
      } catch (error) {
        reject(error);
      }
    }));
    await Promise.all(thingDeletePromises);
    await client.deleteThingType(thingType.Name, thingTypeResponse.headers.etag);
  });

  const pstsResponse = await client.getPropertySetTypesByPackage(packageName);
  const psts = pstsResponse.d.results;
  psts.sort((a, b) => {
    if (a.DataCategory === 'ReferencePropertyData') {
      return -1;
    }
    return b.DataCategory === 'ReferencePropertyData' ? 1 : 0;
  });
  psts.forEach(async (pst) => {
    const pstResponse = await client.getPropertySetType(pst.Name, {}, { resolveWithFullResponse: true });
    await client.deletePropertySetType(pst.Name, pstResponse.headers.etag);
  });
  const packageResponse = await client.getPackage(packageName, { resolveWithFullResponse: true });
  return client.deletePackage(packageName, packageResponse.headers.etag);
}

module.exports = {
  determineTenantPrefix,
  deletePackageCascading,
};
