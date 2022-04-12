const {networks} = require('../constant')
const {staticAssets} = require('../constant');


const userNetworks = async (dbo, userId) =>{
    let userNetworks = await dbo.collection('Networks').find({'userId': userId}).toArray();
    var networkList;
    if(userNetworks.length){
        networkList = networks.concat(userNetworks)
        console.log('userNetwork length-=', networkList.length)
        return networkList
    }else{
        networkList = networks
        console.log('userNetwork length', networkList.length)
        return networks
    }

}



const userAssets = async (dbo, userId) =>{
    let userAsset = await dbo.collection('Assets').find({'userId': userId}).toArray();
    var assetList;
    if(userAsset.length){
        assetList = staticAssets.concat(userAsset)
        console.log('user asset length', assetList.length)
        return assetList
    }else{
        assetList = staticAssets
        console.log('user asset length', assetList.length)
        return assetList
    }

}




module.exports = {userNetworks, userAssets}