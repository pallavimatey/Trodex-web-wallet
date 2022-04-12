const express = require('express');
const router = new express.Router();
const bip39 = require('bip39');
const bcrypt = require('bcryptjs');
const { createWallet } = require('../wallets/createWalletAddress')
const btoa = require('btoa');
var crypto = require("crypto-js");

router.get('/password', async function (req, res, err) {
    let value = req.query
    let dbo = req.app.db
    console.log('Password and confirm password in register function', value.password, value.cPassword)
    if (value.password == value.cPassword) {
        let userPassword = value.password
        console.log('in pass')
        // let hashedPassword = await bcrypt.hash(value.password, 10);  // BCRYPT THE PASSWORD 
        let hashedPassword = crypto.AES.encrypt(JSON.stringify({ userPassword }), 'secret').toString();
        hashedPassword = btoa(hashedPassword);
        console.log('hashed pass', hashedPassword)

        const mnemonic = await bip39.generateMnemonic(); // CREATE A SEED 
        console.log('in ok')
        res.status(200).json({ 'status': 'ok', 'message': 'Mnemonic and Hashed Password', 'result': { 'mnemonic': mnemonic, 'password': hashedPassword }})
    } else {
        console.log('in notOk')
        res.status(200).json({ 'status': 'notOk', 'message': 'Invalid Password.' })
    }
});

router.get('/create-wallet', async function (req, res, err) {
    let dbo = req.app.db;
    console.log('req.query', dbo);
    console.log('req.query', req.query);
    let value = req.query;
    let dataArray = value.seedArray;
    // let dataArray = (value.seedArray).split()
    // let dataString = dataArray.join(" ").trim()

    let dataString = dataArray.replace(/,/g, ' ')
    console.log('datastring', dataString);
    let output = await createWallet(dataString);
    console.log('output', output);
    if (output.status) {
        let checkUser = await dbo.collection('WalletAddress').find({ 'walletAddress': output.result.backendAddress }).toArray();
        console.log('check user length 9n /create wallet', checkUser);
        if (!checkUser.length) {
            let count = await dbo.collection('WalletAddress').find().count();
            let obj = { 'userId': parseInt(count) + 1, 'walletAddress': output.result.backendAddress, 'timeStamp': new Date() };
            await dbo.collection('WalletAddress').insertOne(obj);
            res.status(200).json({ 'status': 'ok', 'message': output.message, 'result': output.result });
        } else {
           console.log('hello in new') 
           res.status(200).json({ 'status': 'notOk', 'message': 'Invalid Seed.' });
        }
    } else {
        res.status(200).json({ 'status': 'notOk', 'message': 'Some Error Occured.' });
    }
});


router.get('/import-wallet', async function (req, res, err) {
    let dbo = req.app.db;
    let value = req.query;
    console.log('req.query', value);
    if (value.password == value.cPassword) {
        let output = await createWallet(value.seed);
        let checkUser = await dbo.collection('WalletAddress').find({ 'walletAddress': output.result.backendAddress }).toArray();
        console.log('check user length 9n /import wallet', checkUser);
        if (!checkUser.length) {
            let count = await dbo.collection('WalletAddress').find().count();
            let obj = { 'userId': parseInt(count) + 1, 'walletAddress': output.result.backendAddress, 'timeStamp': new Date() }
            await dbo.collection('WalletAddress').insertOne(obj);
            res.status(200).json({ 'status': 'ok', 'message': output.message, 'result': output.result });
        } else {
            res.status(200).json({ 'status': 'ok', 'message': 'Wallet Imported Successfully.', 'result': output.result });
           console.log('hello in import');
        }
    } else {
        res.status(200).json({ 'status': 'notOk', 'message': 'Password Does Not Match' });
    }
});

module.exports = router