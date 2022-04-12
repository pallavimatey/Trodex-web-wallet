const { arrToBufArr } = require('ethereumjs-util');
const Web3 = require('web3');
const abi = require('./abi.js')

const { userNetworks } = require('../helper/userAllNetworks')


const addNewNetwork = async (dbo, request) => {
    let value = request.query;
    let obj = { 'userId': request.userId, 'networkName': value.networkName, 'rpc': value.rpc, 'chainId': value.chainId, 'currencySymbol': value.currencySymbol, 'blockExplorer': value.blockExplorer }
    await dbo.collection('Networks').insertOne(obj)
    console.log('in if')
    return { 'status': 1, 'message': 'Network add successfully.' }
}



const addAsset = async (dbo, request) => {
    let value = request.query;
    console.log('value for add asset', value)
    let networkList = await userNetworks(dbo, request.userId)
    let networkDetails = networkList.filter((item)=> {
        return item.chainId == parseInt(value.chainId)
    })
    console.log('result',networkDetails)

    // let networkDetails;
    // for (i = 0; i < networkList.length; i++) {
    //     if (networkList[i].chainId == value.chainId) {
    //         networkDetails = networkList[i]
    //     }
    // }
    // console.log('filter result', networkDetails)

    let url = networkDetails[0].rpc
    console.log('URL',url)
    let web3 = await initializedWeb3(url)
    let contractDetails = await getAssetDetails(value.contractAddress, web3)
    console.log('contract details', contractDetails)
    let obj = { 'userId': request.userId, 'contractAddress': value.contractAddress, 'chainId': value.chainId, 'decimals': contractDetails.decimals, 'assetName': contractDetails.symbol, 'livePrice': 0, 'balance':0 }
    await dbo.collection('Assets').insertOne(obj)

    return { 'status': 1, 'message': 'Asset added Successfully.' }
}




const initializedWeb3 = async (url) => {
    let web3 = new Web3(new Web3.providers.HttpProvider(url));
    return web3
}

const getAssetDetails = async (contractAddress, web3) => {
    console.log('contract address in get asset details', contractAddress)
    contractInstance = new web3.eth.Contract(abi, contractAddress)
   let decimals = await contractInstance.methods.decimals().call()
   console.log('decimals', decimals)
    let symbol = await contractInstance.methods.symbol().call();
    console.log('Decimals && symbols',symbol)
    return { decimals, symbol }
}




module.exports = { addNewNetwork, addAsset }




