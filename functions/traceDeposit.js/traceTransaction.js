const fetch = require('node-fetch')
const Web3 = require('web3')
const { userAssets, userNetworks } = require('../../helper/userAllNetworks');
const { assetType } = require('../../helper/checkAssetType');

// userAddress, contractAddress, chainName, dbo, assetName

const bscRecentTransaction = async (dbo, request) => {
    let assetArray = await userAssets(dbo, request.userId) // FIND THE USER ALL ASSETS 
    let value = request.query;
    let userAddress = request.userAddress;
    let chainId = parseInt(value.chainId);
    let assetName = value.assetName;

    let contractDetails = assetArray.filter((item) => { // FIND CONTRACT ADDRESS
        return item.chainId == parseInt(chainId) && item.assetName == assetName
    })
    console.log('result', contractDetails)
    let contractAddress = contractDetails[0].contractAddress;

    let networkList = await userNetworks(dbo, request.userId) // FIND RPC
    let networkDetails = networkList.filter((item) => {
        return item.chainId == parseInt(value.chainId)
    })



    console.log('result', networkDetails)
    let rpcUrl = networkDetails[0].rpc

    let latestBlock;
    let startBlock = 1;
    let apiUrl;
    let web3;
    let apiKey

    switch (chainId) {
        case 97:
            web3 = new Web3(rpcUrl);
            latestBlock = await web3.eth.getBlock('latest'); // FIND THE LATEST BLOCK NUMBER
            latestBlock = latestBlock.number;
            apiKey = 'QVD93ZGI4PU8YDDD48ZP13AUZ9AYM4X7UE'
            apiUrl = 'https://api-testnet.bscscan.com/api?'
            break;
        case 56:
            web3 = new Web3(rpcUrl);
            latestBlock = await web3.eth.getBlock('latest'); // FIND THE LATEST BLOCK NUMBER
            latestBlock = latestBlock.number;
            apiKey = 'QVD93ZGI4PU8YDDD48ZP13AUZ9AYM4X7UE'
            apiUrl = 'https://api.bscscan.com/api?'
            break;
        case 1:
            web3 = new Web3(rpcUrl);
            latestBlock = await web3.eth.getBlockNumber()// FIND THE LATEST BLOCK NUMBER FOR ETH CHAIN
            apiKey = 'Y2APW9YIAYJP9G3SMHBZ8VMZ1ZNIXT178I'
            apiUrl = 'https://api.etherscan.io/api?'
            break;
        default:
            console.log('Wrong Chain Selected')
    }


   
    let checkAssetType = await assetType(assetName);
    if (checkAssetType) {
        // YOUR ASSET IS TOKEN
        return new Promise(async(resolve, reject) => {
            await fetch(`${apiUrl}module=account&action=tokentx&contractaddress=${contractAddress}&address=${userAddress}&page=1&offset=50&startblock=${startBlock}&endblock=${latestBlock}&sort=asc&apikey=${apiKey}`)//testnet
                // await fetch(`https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=${contractAddress}&address=${userAddress}&page=1&offset=50&startblock=${startBlock}&endblock=${latest}&sort=asc&apikey=QVD93ZGI4PU8YDDD48ZP13AUZ9AYM4X7UE`, requestOptions)
                .then(response => response.text())
                .then(async result => {
                    let data = JSON.parse(result)
                    console.log(data)
                    resolve(data)
                })
                .catch(error => reject(error));
        })

    } else {
        // YOUR ASSET IS COIN
        return new Promise(async(resolve, reject) => {
            await fetch(`${apiUrl}module=account&action=txlist&address=${userAddress}&startblock=${startBlock}&endblock=${latestBlock}&page=1&offset=50&sort=asc&apikey=${apiKey}`)
                .then(response => response.text())
                .then(async result => {
                    let data = JSON.parse(result)
                    console.log(data)
                    resolve(data);
                })
                .catch(error => reject(error));
        })
    }

}

module.exports = { bscRecentTransaction}


