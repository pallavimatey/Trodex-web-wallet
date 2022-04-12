const express = require('express');
const router = new express.Router();
const {staticAssets} = require('../constant');
const findUser = require('../helper/findUserId')
const {addAsset} = require('../functions/addNetwork');
const { request } = require('express');
const findLivePrice = require('../helper/livePrice')
const {userAssets} = require('../helper/userAllNetworks')

router.get('/get-asset', [findUser], async function (req, res, err) {
    console.log('user id in get asset', req.userId)
    let dbo = req.app.db
    let assetArray = await userAssets(dbo, req.userId)
    if(assetArray.length){
        // let assetArrayLivePrice = await findLivePrice(assetArray)
        console.log('assetArrayLivePrice assetArrayLivePrice', assetArray)
        res.status(200).json({ 'status': 'ok', 'message': 'Asset List.', result: assetArray })
    }else{
        res.status(200).json({ 'status': 'notOk', 'message': 'Asset List not Found.', result: [] })
    }
})




router.get('/add-asset', [findUser], async function(req, res, err){
    console.log('user id in add asset', req.userId)
    let dbo = req.app.db
    let output = await addAsset(dbo, req)
    if(output.status){
        res.status(200).json({ 'status': 'ok', 'message': output.message })
    }else{
        res.status(200).json({ 'status': 'notOk', 'message': 'Invalid Password.' })
    }
})


router.get('/remove-asset', [findUser], async function(req, res, err){
    console.log('user id in add asset', req.userId, req.query)
    let dbo = req.app.db
    await dbo.collection('Assets').deleteOne({userId: req.userId, 'assetName': req.query.assetName, 'chainId': req.query.chainId})
    let assetArray = await userAssets(dbo, req.userId)
    if(assetArray.length){
        res.status(200).json({ 'status': 'ok', 'message': 'Asset Deleted Successfully.', result: assetArray })
    }else{
        res.status(200).json({ 'status': 'notOk', 'message': 'Asset List not Found.', result: [] })
    }
})



module.exports = router