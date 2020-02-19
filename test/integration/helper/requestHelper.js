function determineTenantPrefix(client) {
    return client.request({
        url: `${client.navigator.businessPartner()}/Tenants`
    }).then((response) => {
        return response.value[0].package;
    });
}

async function deletePackageCascading(client, packageName) {
    let packageResponse;
    try {
        const thingTypesResponse = await client.getThingTypesByPackage(packageName);
        const thingTypes = thingTypesResponse.d.results;
        for (const thingType of thingTypes) {
            const thingTypeResponse = await client.getThingType(thingType.Name, {}, {resolveWithFullResponse: true});
            const thingsResponse = await client.getThingsByThingType(thingType.Name);
            const thingDeletePromises = thingsResponse.value.map((thing)=>{
                return new Promise(async (resolve, reject)=>{
                    try {
                        const events = await client.getEventsByThingId(thing._id);
                        const eventDeletePromises = [];
                        for (const event of events.value) {
                            eventDeletePromises.push(client.deleteEvent(event._id));
                        }
                        await Promise.all(eventDeletePromises);
                        await client.deleteThing(thing._id);
                        resolve();
                    } catch (error) {
                        reject(error);
                    } 
                });
            });
            await Promise.all(thingDeletePromises)
            await client.deleteThingType(thingType.Name, thingTypeResponse.headers.etag);
        }

        const pstsResponse = await client.getPropertySetTypesByPackage(packageName);
        const psts = pstsResponse.d.results;
        psts.sort((a, b) => ((a.DataCategory === 'ReferencePropertyData') ? -1 : ((b.DataCategory === 'ReferencePropertyData') ? 1 : 0)));
        for (const pst of psts) {
            const pstResponse = await client.getPropertySetType(pst.Name, {}, {resolveWithFullResponse: true});
            await client.deletePropertySetType(pst.Name, pstResponse.headers.etag);
        }
        packageResponse = await client.getPackage(packageName, {resolveWithFullResponse: true});
    }catch (error) {
        throw (error);
    }
    return client.deletePackage(packageName, packageResponse.headers.etag);
}

module.exports = {
    determineTenantPrefix: determineTenantPrefix,
    deletePackageCascading: deletePackageCascading
};
