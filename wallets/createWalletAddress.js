var bip39 = require('bip39');
var hdkey = require('hdkey');
const { toChecksumAddress } = require('ethereum-checksum-address')
const ethUtil = require('ethereumjs-util')
const bcrypt = require('bcrypt')
var crypto = require("crypto-js");
const btoa = require('btoa')

const createWallet = async (mnemonic) => {
    console.log('Mnemonic is ======================', mnemonic)
    const seed = await bip39.mnemonicToSeed(mnemonic); //creates seed buffer
    const root = hdkey.fromMasterSeed(seed);
    const masterPrivateKey = root.privateKey.toString('hex');

    const addrNode = root.derive("m/44'/60'/0'/0/0"); //line 1
    const privateKey = (addrNode._privateKey).toString('hex');

    const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
    // console.log('pub key ', pubKey);
    const addr = ethUtil.publicToAddress(pubKey).toString('hex');
    // console.log('addr', addr)
    const address = toChecksumAddress(addr)

    // let hashedAddress = CryptoJS.AES.encrypt(address, 'secret key 123').toString();
    // let hadhedPrivateKey = CryptoJS.AES.encrypt(privateKey, 'secret key 123').toString();


    console.log('hashed address and privake key is -==-=-=-=-', address, privateKey)
    let hashedAddress = crypto.AES.encrypt(JSON.stringify({ address }), 'secret').toString();
    let hadhedPrivateKey = crypto.AES.encrypt(JSON.stringify({ privateKey }), 'secret').toString();


    hashedAddress = btoa(hashedAddress);
    hadhedPrivateKey = btoa(hadhedPrivateKey);









    // const hashedAddress = await bcrypt.hash(address, 10);  // BCRYPT THE WALLET ADDRESS
    // const hashedPrivateKey = await bcrypt.hash(privateKey, 10);  // BCRYPT THE PRIVATE KEY
    return { 'status': 1, 'message': 'Wallet and Private Key', 'result': { 'address': hashedAddress, 'privateKey': hadhedPrivateKey, 'backendAddress': address } }
}



module.exports = { createWallet }

// createWallet('remind remove flat differ elbodw agree nest essssay pioneer boost gasp slogan')