const assetType = async (asset) => {
    if (asset == 'BTC' || asset == 'ETH' || asset == 'BNB') {
        console.log('in if ')
        return 0;
    } else {
        console.log('in else')
        return 1;
    }
}



module.exports = {assetType}