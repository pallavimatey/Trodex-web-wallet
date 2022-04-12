const express = require('express');
const router = new express.Router();
const findUser = require('../helper/findUserId')
const {addNewNetwork} = require('../functions/addNetwork');
const { request } = require('express');
const {userNetworks} = require('../helper/userAllNetworks')
const {addNetworkValidation} = require('../validations/regExp')

// const {networks} = require('../constant')

router.get('/get-network', [findUser], async function(req, res, err){
    let dbo = req.app.db;
    console.log('user id in get network', req.userId)
    let networkList = await userNetworks(dbo, req.userId)
    console.log('= netrorks .length', networkList.length)
    res.status(200).json({ 'status': 'ok', 'message': 'Network List', result: networkList })
})


router.get('/add-network', [findUser, addNetworkValidation], async function(req, res, err){
    let dbo = req.app.db
    console.log('user id in add network', req.userId)
    let output = await addNewNetwork(dbo, req)
    if(output.status){
        res.status(200).json({ 'status': 'ok', 'message': output.message })
    }else{
        res.status(200).json({ 'status': 'notOk', 'message': 'NO Network.' })
    }
})


module.exports = router