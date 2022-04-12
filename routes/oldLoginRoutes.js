// const express = require('express');
// const router = new express.Router();
// const { signUp, login } = require('../functions/loginFunction');


// router.get('/password', async function(req, res, err){
//     console.log('Query Request in password function', req.query);
//     let dbo = req.app.db
//     let output = await signUp(dbo, req)
//     console.log('OUTPUT in password route', output)
//     if(output.status){
//         res.status(200).json({'status': 'ok', 'message': output.message, 'result': output.result});
//     }else{
//         res.status(200).json({'status': 'notOk', 'message': output.message});
//     }
// })

// router.get('/password', async function(req, res, err){
//     let value = req.query
//     console.log('Password and confirm password in register function', value.password, value.cPassword)
//     if (value.password == value.cPassword) {
//         let hashedPassword = await bcrypt.hash(value.password, 10);  // BCRYPT THE PASSWORD 
//         const mnemonic = await bip39.generateMnemonic(); //generates string
//         return { 'status': 1, 'message': 'Mnemonic', 'result': { 'mnemonic': mnemonic, 'hashedPassword': hashedPassword } }
//     } else {
//         return { 'status': 0, 'message': 'Password and Confirm Password does not match.' }
//     }
// })


// router.get('/login', async function(req, res, err){
//     console.log('Query Request in login function', req.query);
//     let dbo = await req.app.db
//     let output = await login(dbo, req)
//     if(output.status){
//         res.status(200).json({'status': 'ok', 'message': output.message, 'result': output.result});
//     }else{
//         res.status(200).json({'status': 'notOk', 'message': output.message});
//     }
// })



// module.exports = router