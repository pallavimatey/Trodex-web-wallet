// let url = 'https://data-seed-prebsc-1-s1.binance.org:8545';
// let networkId = 97



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



const staticAssets = [{
    'userId': '',
    'contractAddress': '0xd9875da4bd4a08d874166167c85e763d286609ee',
    'chainId': 97,
    'decimals': 18,
    'assetName': 'BNB',
    'livePrice': 0,
    'balance':0
},
{
    'userId': '',
    'contractAddress': '0xd9875da4bd4a08d874166167c85e763d286609ee',
    'chainId': 97,
    'decimals': 10,
    'assetName': 'BPNT',
    'livePrice': 0,
    'balance':0
}
]



// const staticAssets = [{ 'userId': '', 'contractAddress': '0xd9875da4bd4a08d874166167c85e763d286609ee', 'chainId': '97', 'decimals': '18', 'assetName': 'BNB', 'livePrice': 0 },
// { 'userId': '', 'contractAddress': '0xd9875da4bd4a08d874166167c85e763d286609ee', 'chainId': '97', 'decimals': '10', 'assetName': 'BPNT', 'livePrice': 0 }]

module.exports = { networks, staticAssets }