// var crypto = require("crypto-js");
// var atob = require('atob')


// (async (req, res, next) => {
//     console.log('req.query in find user function', req.query, req.url)
//     let value = 'VTJGc2RHVmtYMThseU5INTNYaHptTXVwTkUvMjF5REUvYStibUZjVUVyVzFDNUsvKzd3YnUwUWx6UWczVkFYaTNzTUZCVHkreit4dnZPOGl6aVN2a0J4LzRTai9WRWNaRlpSK0VDTkplSFE9'
//     let userAddress = atob(value)
//     let cryptoAddress = crypto.AES.decrypt(userAddress, 'secret').toString(crypto.enc.Utf8);
//     let fromAddress = (JSON.parse(cryptoAddress)).address
//     let userDetails = await dbo.collection('WalletAddress').find({'walletAddress': fromAddress}).toArray();
//     if(userDetails.length){
//         req.userId = userDetails[0].userId;
//         req.userAddress = userDetails[0].walletAddress;
//         console.log('user id and user address in middleware', req.userId, req.userAddress)
//         next();
//     }else{
//         res.status(200).json({'status': 'notOk', 'message': 'Invalid User.'})
//     }
// }
// )()

const Web3 = require('web3')
const abi = require('./abis/transferAbi');

(async (req, res, next) => {

    let web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/')

    let c = new web3.eth.Contract(abi, '0xd9875da4bd4a08d874166167c85e763d286609ee')

    let balance = await c.methods.balanceOf('0x78cC08303cD5b345194A01ed4a5C1183FCcf5A16').call();
    balance = balance / 10 ** 9;
    console.log(balance)

})()


