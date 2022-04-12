var crypto = require("crypto-js");
var atob = require('atob')


const findUser = async (req, res, next) => {
    let dbo = req.app.db
    console.log('req.query in find user function', req.query, req.url)
    let value = req.query
    let userAddress = atob(value.userAddress)
    let cryptoAddress = crypto.AES.decrypt(userAddress, 'secret').toString(crypto.enc.Utf8);
    let fromAddress = (JSON.parse(cryptoAddress)).address
    let userDetails = await dbo.collection('WalletAddress').find({'walletAddress': fromAddress}).toArray();
    console.log('fromAddress', fromAddress)
    if(userDetails.length){
        req.userId = userDetails[0].userId;
        req.userAddress = userDetails[0].walletAddress;
        console.log('user id and user address in middleware', req.userId, req.userAddress)
        next();
    }else{
        res.status(200).json({'status': 'notOk', 'message': 'Invalid User.'})
    }
}

module.exports = findUser