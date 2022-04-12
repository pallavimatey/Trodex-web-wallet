var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
const express = require('express');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const port = 8000;
const cors = require('cors');
app.use(cors([ 'https://wallet.trodex.io/', 'http://wallet.trodex.io', 'http://165.232.178.37:8000', 'https://165.232.178.37:8000/']))

let allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', `*`);
    // res.header('Access-Control-Allow-Origin', "https://wallet.trodex.io/");
    res.header('Access-Control-Allow-Headers', `*`);
    // res.header('Access-Control-Allow-Headers', "https://wallet.trodex.io/");
    next();
}
app.use(allowCrossDomain);

// https://wallet.trodex.io/

// mongodb connection
var dbo;
var url = "mongodb://localhost:27017/"
MongoClient.connect(url, async (err, db) => {
    if (err) throw err
    dbo = db.db('wallet')
    app.db = dbo
    console.log('Database Connected')
})



const loginRoutes = require('./routes/loginRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const addNetworkRoutes = require('./routes/addNetworkRoutes');
const addAssetRoutes = require('./routes/addAssetRoutes');


app.use(loginRoutes)
app.use(transactionRoutes)
app.use(addNetworkRoutes)
app.use(addAssetRoutes)


app.get('/static', async function (req, res, err) {
    let networks = [
        {
            userId: '',
            networkName: 'Ethereum Mainnet',
            rpc: 'https://restless-divine-tree.quiknode.pro/40479502d52ac3215aebfb8550f3c2a9a1b965f4/',
            chainId: 1,
            currencySymbol: 'ETH',
            blockExplorer: 'https://etherscan.io'
        },
        {
            userId: '',
            networkName: 'Binance Smart Chain',
            rpc: 'https://bsc-dataseed.binance.org/',
            chainId: 56,
            currencySymbol: 'BNB',
            blockExplorer: 'https://bscscan.com'
        },
        {
            userId: '',
            networkName: 'Binance Testnet',
            rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545',
            chainId: 97,
            currencySymbol: 'BPNT',
            blockExplorer: 'https://testnet.bscscan.com'
        }
    ]
        await dbo.collection('Networks').insertMany(networks)
    res.status(200).json({ status: 'ok' })
})

// app.get('/add-asset', async function(req, res, err){
//     console.log('afhksahdfliahildfhlkaidhflkjah')
// })




const server = app.listen(port, () => {
    console.log(`request listen at port no ${port}`)
})