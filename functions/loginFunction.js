// const bcrypt = require('bcrypt');
// const createBnbAddress = require('../wallets/createWalletAddress');
// const { createToken } = require('../helper/jwtToken')

// const signUp = async (dbo, request) => {
//     let hashedPassword = await bcrypt.hash(request.query.password, 10);  // BCRYPT THE PASSWORD 
//     let checkPassword = await dbo.collection('UserDetail').find({ 'password': request.query.password }).count(); // CHECK THAT PASSWORD IS EXIST IN DATABASE OR NOT 
//     console.log('check password', checkPassword);

//     if (checkPassword) {
//         return { 'status': 0, 'message': 'Invalid Password' }
//     } else {
//         let userCount = await dbo.collection('UserDetail').find().count(); // FIND THE COUNT OF USERDETAIL COLLECTION FOR AUTO INCRIMENT
//         let bnbWalletAddress = await createBnbAddress(); // THIS FUNCTION RETURNS THE WALLET ADDRESS AND PRIVATE KEY
//         let hashedPrivateKey = await bcrypt.hash(bnbWalletAddress.privateKey, 10);  // BCRYPT THE PRIVATE KEY 
//         let obj = { 'userId': userCount + 1, 'userPassword': hashedPassword, 'password': request.query.password }
//         await dbo.collection('UserDetail').insertOne(obj); // INSERT USER DETAILS IN DATABASE
//         let walletObj = { 'userId': obj.userId, 'bnbWalletAddress': bnbWalletAddress.address, 'bnbPrivateKey': hashedPrivateKey, 'mnemonic': bnbWalletAddress.mnemonic }
//         await dbo.collection('WalletAddress').insertOne(walletObj); // INSERT USER WALLET DETAILS IN DATABASE

//         let jwtToken = await createToken(dbo, obj.userId, hashedPassword);  // CREATE A JWT TOKEN WITH USER ID AND PASSWORD
//         if (jwtToken) {
//             let tokenObj = { 'userId': obj.userId, 'token': jwtToken }
//             await dbo.collection('jwtToken').insertOne(tokenObj);  // INSERT JWT TOKEN
//         }
//         return { 'status': 1, 'message': 'Seed and Jwt Token is ', result: { 'jwtToken': jwtToken, 'mnemonic': bnbWalletAddress.mnemonic } }
//     }
// }



// const login = async (dbo, request) => {
//     let userDetails = await dbo.collection('UserDetail').find({ 'password': request.query.password }).toArray();
//     if (userDetails.length) {
//         let jwtToken = await createToken(dbo, userDetails[0].userId, userDetails[0].hashedPassword);  // CREATE A JWT TOKEN WITH USER ID AND PASSWORD
//         if (jwtToken) {
//             await dbo.collection('jwtToken').updateOne({ 'userId': userDetails[0].userId }, { $set: { 'token': jwtToken } }) // UPDATE THE JWT TOKEN
//             return { 'status': 1, 'message': 'JWT Token is ', result: { 'jwtToken': jwtToken } }
//         }
//     } else {
//         return { 'status': 0, 'message': 'Invalid Password' }
//     }
// }

// module.exports = { signUp, login }