const fetch = require('node-fetch');

const getLivePrice = (asset)=>{
    console.log('asset for find live price', asset)
    return new Promise((resolve,reject)=>{
        // var requestOptions = {
        //     method: 'GET',
        //     headers: {"X-CoinAPI-Key": "72BE46E6-14B4-4264-A904-31C19997C049"},
        //     redirect: 'follow'
        // };
        fetch(`https://api.vindax.com/api/v1/returnticker`)
        .then(response => response.text())
        .then(result => {let a=JSON.parse(result);
            let assetPair = asset.concat('_USDT')
            console.log('assetpair', assetPair)
            console.log('assetpair a', a[assetPair])
            if(!a[assetPair]) {
                resolve(0)
            }else{
                resolve( a[assetPair].last)
            }

        })
        .catch(error => {console.log('error', error);reject(error)});
    })
};

const findLivePrice = async(assetArray) =>{
    console.log('Assets array for live price', assetArray);
    if(assetArray.length){
        for(i=0; i<assetArray.length; i++){
            console.log(i)
            let price = await getLivePrice(assetArray[i].assetName);
            console.log('Live price for ' + assetArray[i].assetName + 'is ' + price)
            assetArray[i].livePrice = price;
        }
        return assetArray;
    }else{
        console.log('empty asset array')
    }
};


// getLivePrice('BNB')
module.exports = findLivePrice





// const fetch = require('node-fetch');

// const getLivePrice = (asset)=>{
//     console.log('asset for find live price', asset)
//     return new Promise((resolve,reject)=>{
//         var requestOptions = {
//             method: 'GET',
//             headers: {"X-CoinAPI-Key": "72BE46E6-14B4-4264-A904-31C19997C049"},
//             redirect: 'follow'
//         };
//         fetch(`https://rest.coinapi.io/v1/exchangerate/${asset}/USD`, requestOptions)
//         .then(response => response.text())
//         .then(result => {let a=JSON.parse(result) ;console.log(a.rate); resolve(a.rate)})
//         .catch(error => {console.log('error', error);reject(error)});
//     })
// }

// const findLivePrice = async(assetArray) =>{
//     console.log('Assets array for live price', assetArray);
//     if(assetArray.length){
//         for(i=0; i<assetArray.length; i++){
//             let price = await getLivePrice(assetArray[i].assetName);
//             console.log('Live price for ' + assetArray[i].assetName + 'is ' + price)
//             assetArray[i].livePrice = price;
//         }
//         return assetArray;
//     }else{
//         console.log('empty asset array')
//     }
// }


// // getLivePrice('BNB')
// module.exports = findLivePrice





