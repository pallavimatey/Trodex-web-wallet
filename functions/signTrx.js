const bcrypt = require('bcrypt')
const { networks } = require('../constant')
const abi = require('../abis/transferAbi')
const { transferBnb, transferTokens, initializedWeb3 } = require('../functions/blockChainFunctions/transferAssets')
var crypto = require("crypto-js");
const atob = require('atob')
const { staticAssets } = require('../constant');

const signTransaction = async (dbo, request) => {
    let value = request.query
    request.query.chainId = 97
    let networkId = parseInt(value.chainId)
    console.log('from address and private key in signtrx file', value.userAddress, value.privateKey)
    var userContractAddresses;
    let userNetworks = await dbo.collection('Assets').find({ 'userId': request.userId }).toArray();
    if (userNetworks.length) {
        userContractAddresses = staticAssets.concat(userNetworks)
    } else {
        userContractAddresses = staticAssets
    }

    var assetContractAddress;

    console.log('uuser all contract addresses ', userContractAddresses.length)
    for (i = 0; i < userContractAddresses.length; i++) {
        if (userContractAddresses[i].assetName == value.asset) {
            console.log('in if', userContractAddresses[i])
            console.log('contract Addres in sign trx', userContractAddresses[i].contractAddress)
            assetContractAddress = userContractAddresses[i].contractAddress
        }
    }
    console.log('contractAddress for trx', assetContractAddress)



    let url = networks.filter(network=>{
        return network.chainId==networkId
    })



    let contractDetails = await dbo.collection('ContractAddress').find({ 'assetName': value.asset }).toArray();
    console.log('contract details', contractDetails)
    console.log('url', url)
    var web3 = await initializedWeb3(url[0].rpc);
    let userAddress = atob(value.userAddress)
    let userPrivateKey = atob(value.privateKey)

    let cryptoAddress = crypto.AES.decrypt(userAddress, 'secret').toString(crypto.enc.Utf8);
    let cryptoKey = crypto.AES.decrypt(userPrivateKey, 'secret').toString(crypto.enc.Utf8);
    let fromAddress = (JSON.parse(cryptoAddress)).address
    let privateKey = (JSON.parse(cryptoKey)).privateKey
    console.log('fromAddress = ', fromAddress)
    console.log('privateKey = ', privateKey)


    let toAddress = value.withdrawalAddress;
    let assetName = value.asset;
    let amount = parseFloat(value.withdrawalAmount);
    let contractAddress = assetContractAddress
    //TODO: change BPNT to check if every token is of type token.
    if (assetName == 'BPNT') {
        let decimalValue = 9
        let contractInstance = new web3.eth.Contract(abi, contractAddress)  // CREATE CONTRACT INSTANCE // SEND CONTRACT ADDRESS
        let output = await transferTokens(web3, fromAddress, toAddress, amount, decimalValue, contractAddress, privateKey, contractInstance, url)

        console.log('output in signtrx.js file', output)
        if (output.status) {
            // let userId = await newUserId(dbo, fromAddress);
            // console.log('in if out', userId)
            let obj = { 'userId': request.userId, 'userAddress': fromAddress, 'toAddress': toAddress, 'asset': assetName, 'amount': amount, 'txHash': output.result, timeStamp: new Date() }
            await dbo.collection('WithdrawRequests').insertOne(obj)
            return output
        } else {
            console.log('in else out')
            return output
        }
    } else {
        let trxResponse = await transferBnb(web3, fromAddress, toAddress, amount, privateKey, networkId,url)
        console.log('trx response in trasfer bnb', trxResponse)
        if (trxResponse.status) {
            // let userId = await newUserId(dbo, fromAddress);
            // console.log('in sign coin if ', userId)
            let obj = { 'userId': request.userId, 'userAddress': fromAddress, 'toAddress': toAddress, 'asset': assetName, 'amount': amount, 'txHash': trxResponse.result, timeStamp: new Date() }
            await dbo.collection('WithdrawRequests').insertOne(obj)
            return trxResponse
        } else {
            console.log('else sign coin if ', trxResponse)
            return trxResponse
        }
    }
}


const newUserId = async (dbo, fromAddress) => {
    let userId;
    let count = await dbo.collection('WithdrawRequests').find().count();
    if (!count) {
        userId = 1;
        return userId;
    } else {
        let checkUserAddress = await dbo.collection('WithdrawRequests').find({ 'userAddress': fromAddress }).toArray();
        if (checkUserAddress.length) {
            userId = checkUserAddress[0].userId;
            return userId;
        } else {
            let newUserId = await dbo.collection('WithdrawRequests').find().sort({ userId: -1 }).toArray();
            userId = newUserId[0].userId + 1;
            return userId;
        }
    }


}

module.exports = { signTransaction }