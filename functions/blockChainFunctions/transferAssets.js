const Common = require('ethereumjs-common')
const Tx = require("ethereumjs-tx");
const Web3 = require('web3')
const abi = require('../../abis/transferAbi')


const initializedWeb3 = async (url) => {
    let web3 = new Web3(new Web3.providers.HttpProvider(url));
    return web3
}

const transferBnb = async (web3, fromAddress, toAddress, value, private_key, networkId, url) => {
    console.log('fromAddress, toAddress, value, private_key, networkId', fromAddress, toAddress, value, private_key, networkId)
    let balance = await web3.eth.getBalance(fromAddress)
    let amount = (value * 10 ** 18)
    if (balance < 10 ** 16 + amount) { // +amount
        // throw error   errorMessage 'BNB balance is low. Please deposit bnb to carry out the transaction.'
    }
    let gasPriceHex = web3.utils.toHex(10000000000);
    let gasLimitHex = web3.utils.toHex(6000000);
    let nonce = await web3.eth.getTransactionCount(fromAddress, 'pending');
    let gas = await web3.eth.estimateGas({ amount, from: fromAddress, to: toAddress })
    let rawTx = { nonce, gas, gasPrice: gasPriceHex, gasLimit: gasLimitHex, value:amount, from: fromAddress, to:toAddress };
    let privateKey = new Buffer.from(private_key, 'hex')

    let tx = await getSignedTx(networkId, url, privateKey, rawTx)
    console.log('SIGNED TX IN TRANSFER BNB', tx)
    let reciept = await sendTx(web3, tx)
    console.log('Return Reciept ', reciept)
    return reciept;


}

async function transferTokens(web3, fromAddress, toAddress, amount, decimalValue, contractAddress, private_key, contractInstance, url) {
    let c = new web3.eth.Contract(abi, contractAddress)
    let value = amount * (10 ** decimalValue)
    let data = c.methods.transfer(toAddress, value).encodeABI();
    let balance = await web3.eth.getBalance(fromAddress)
    console.log('BALANCE AND TOKEN IN TRANSFER TOKENS IN BLOCKCHAIN FUNCTION', balance)
    if (balance < 10 ** 16 + value) {
        console.log('low bal')
        return 0; // 'Insufficient Balance.'
        // throw error   errorMessage 'BNB balance is low. Please deposit bnb to carry out the transaction.'
    }
   
    let gasPriceHex = web3.utils.toHex(10000000000);
    let gasLimitHex = web3.utils.toHex(600000);
    let nonce = await web3.eth.getTransactionCount(fromAddress, 'pending');
    let gas = await web3.eth.estimateGas({ data, from: fromAddress, to: contractAddress })
    let rawTx = { nonce, gasPrice: gasPriceHex, gasLimit: gasLimitHex, data, from: fromAddress, to: contractAddress };
    let privateKey = new Buffer.from(private_key, 'hex')
    // let networkId = 56 
    let signedTx = await getSignedTx(networkId, url, privateKey, rawTx)
    console.log('getSignedTx output in transfer token ', signedTx)

    let tx = await getSignedTx(networkId, url, privateKey, rawTx)
    console.log('SIGNED TX IN TRANSFER Token', tx)
    let reciept = await sendTx(web3, tx)
    console.log('Return Reciept ', reciept)
    return reciept;


}


const getSignedTx = async (networkId, url, privateKey, rawTx) => {
    const common = Common.default.forCustomChain('mainnet', { name: 'bnb', networkId: networkId, chainId: networkId, url: url }, 'petersburg');
    let tx = new Tx.Transaction(rawTx, { common });
    tx.sign(privateKey);
    let serializedTx = tx.serialize();
    return '0x' + serializedTx.toString('hex')
}



const sendTx = async (web3, signedTx) => {
    //return new Promise(async (resolve, reject) => {
    let receipt = null;

    try {
        receipt = await web3.eth.sendSignedTransaction(signedTx)
        console.log('receipt details in send tx', receipt)
        return { 'status': 1, 'message': 'Transaction Hash', 'result': receipt.transactionHash }
    } catch (error) {
        console.log('error message in send tx', JSON.stringify(error.message))
        return { 'status': 0, 'message': 'Transaction Failed', 'result': '' }
    }

}








// const sendTx = async (web3, signedTx) => {
//     return new Promise(async (resolve, reject) => {
//         let receipt = null;
//         //  Submit the smart contract deployment transaction
//         let reciept = web3.eth.sendSignedTransaction(signedTx, async (err, hash) => {
//             if (err) {
//                 console.log('error in send signed tx in send tx', err.message);
//                 reject('err.messadddge')
//             } else {
//                 console.log('hash of sending tx to contract', hash)
//                 while (!receipt) {
//                     receipt = await web3.eth.getTransactionReceipt(hash);
//                 }
//                 let reciptDetails = JSON.stringify(receipt);
//                 reciptDetails = JSON.parse(reciptDetails)
//                 resolve(reciptDetails)
//             }
//         })
//         // return reciept
//     })
// }


module.exports = { transferBnb, transferTokens, initializedWeb3 }

