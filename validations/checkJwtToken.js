const {tokenCheck} = require('../helper/jwtToken');


const checkJwtToken = async(req,res,next) => {
    console.log('Requested Url in check jwt token', req.url);
    // console.log('token in check jwt token', req.headers.authorization)
    let verify = await tokenCheck(req.query.token);
    console.log('token details verify ', verify)
    if(verify.status){
        req.userId = verify.result.userId
        req.userPassword = verify.result.userPassword
        next()
    }else{
        res.status(200).json({'status': 'notOk', 'message': verify.message})
    }
}
module.exports = checkJwtToken