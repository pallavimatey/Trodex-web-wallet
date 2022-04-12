const { userAssets, userNetworks } = require('../helper/userAllNetworks');

const networkFilter = async(dbo, userId, chainId) =>{
    let networkList = await userNetworks(dbo, userId) // FIND RPC
    let networkDetails = networkList.filter((item) => {
        return item.chainId == chainId
    })
    return networkDetails;

}

const assetFilter = async (dbo, userId, assetName, chainId) =>{
    let assetArray = await userAssets(dbo, userId) // FIND THE USER ALL ASSETS 
    let contractDetails = assetArray.filter((item) => { // FIND CONTRACT ADDRESS
        console.log('teim', item, chainId, assetName)
        return item.chainId == chainId && item.assetName == assetName
    })
    console.log('result', contractDetails)
    return contractDetails
}

module.exports = {networkFilter, assetFilter}