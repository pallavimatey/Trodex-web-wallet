const fetch = require('node-fetch')
const Web3 = require('web3')
const { userAssets, userNetworks } = require('../../helper/userAllNetworks');
const { assetType } = require('../../helper/checkAssetType');
const abi = require('../abi')
const {assetFilter, networkFilter} = require('../../helper/filterHelp')
// userAddress, contractAddress, chainName, dbo, assetName

const userAssetBalance = async (dbo, request) => {
    let value = request.query
    let userAddress = request.userAddress
    let chainId = parseInt(value.chainId);
    let assetName = value.assetName

    let contractDetails = await assetFilter(dbo, request.userId, assetName, chainId)
    console.log('contract details for balance', contractDetails)

    // let assetArray = await userAssets(dbo, request.userId) // FIND THE USER ALL ASSETS 
    // console.log('asset array length in user asset balance', assetArray.length)
    // let contractDetails = assetArray.filter((item) => { // FIND CONTRACT ADDRESS
    //     console.log('teim', item, chainId, assetName)
    //     return item.chainId == chainId && item.assetName == assetName
    // })
    let contractAddress = contractDetails[0].contractAddress; 
    let decimal = contractDetails[0].decimals

    let networkDetails = await networkFilter(dbo, request.userId, chainId)
    // let networkList = await userNetworks(dbo, request.userId) // FIND RPC
    // let networkDetails = networkList.filter((item) => {
    //     return item.chainId == parseInt(value.chainId)
    // })
    console.log('network details for balance ', networkDetails)



    let rpcUrl = networkDetails[0].rpc
    let apiUrl;
    let web3;
    let apiKey;
    let c;
    switch (chainId) {
        case 97:

            web3 = new Web3(rpcUrl);
            c = new web3.eth.Contract(abi, contractAddress)
            break;
        case 56:
            web3 = new Web3(rpcUrl);
            c = new web3.eth.Contract(abi, contractAddress)
            break;
        case 1:
            web3 = new Web3(rpcUrl);
            c = new web3.eth.Contract(abi, contractAddress)
            break;
        default:
            console.log('Wrong Chain Selected')
    }



    let checkAssetType = await assetType(assetName);
    if (checkAssetType) {
        // YOUR ASSET IS TOKEN
        let balance = await c.methods.balanceOf(userAddress).call()
        return (balance/ 10**decimal)
    } else {
        // YOUR ASSET IS COIN
        let balance = await web3.eth.getBalance(userAddress);
        return (balance/ 10**decimal)

    }

}

module.exports = { userAssetBalance }



