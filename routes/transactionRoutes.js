const express = require('express');
const router = new express.Router();
const findUser = require('../helper/findUserId')
const { signTransaction } = require('../functions/signTrx')
const {signTrxValidation} = require('../validations/regExp')
const {bscRecentTransaction} = require('../functions/traceDeposit.js/traceTransaction')
const {userAssetBalance } = require('../functions/traceDeposit.js/balanceApi')

router.get('/sign-trx', [findUser, signTrxValidation], async function (req, res, err) {
  let dbo = req.app.db
  console.log('Query Request in login function', req.query);
  let output = await signTransaction(dbo, req)
  console.log('output in sign-trx', output)
  if (output.status) {
    console.log('response .se')
    res.status(200).json({ 'status': 'ok', 'message': output.message, 'result': output.result })
  } else {
    res.status(200).json({ 'status': 'notOk', 'message': output.message })
  }
});



router.get('/trx-history', [findUser], async function (req, res, err) {
  let dbo = req.app.db
  let value = req.query
  let data = await dbo.collection('WithdrawRequests').find({ userAddress: req.userAddress }).toArray();
  // let data = await dbo.collection('WithdrawRequests').find().toArray();
  console.log('data.length', data.length)
  if (data.length) {
    res.status(200).json({ 'status': 'ok', 'message': 'Transactions History.', result: data })
  } else {
    res.status(200).json({ 'status': 'notOk', 'message': 'Transactions not Found.' })
  }
})

router.get('/deposit-history', [findUser], async function (req, res, err) {
  let dbo = req.app.db

  console.log('VTJGc2RHVmtYMStKTlRPRGJlenJJYUt1cVRpTU1DSUNSRTgxa0ZXcHNhMFhib21ldnV5MFlENjJxRDFJMVZBUVZzQjJHbm5RaS9TQzlqTmtkYyt1WkxnejdMOU1LVUMyck5SNFNHSWNESm89')
  let output = await bscRecentTransaction(dbo, req)
  console.log('bscRecent transaction in trx routes.js', output)
  res.status(200).json({'status': 'ok', result: output})
})


router.get('/user-balance', [findUser], async function (req, res, err) {
  let dbo= req.app.db
  let output = await userAssetBalance(dbo, req)
  console.log('bscRecent transaction in trx routes.js', output)
  res.status(200).json({'status': 'ok', result: output})
})

// /sign-trx -> signTransaction (signTrx.js) -> transferTokens (transferAssets.js)-> 
module.exports = router