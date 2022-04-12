const jwt = require('jsonwebtoken');

const createToken = async(dbo, userId, password) =>{
    return new Promise(async (resolve, reject) => {
console.log('userId and pa', userId, password);
        await jwt.sign({'userId': userId, 'userPassword': password }, 'secretKey', (err, token) =>{
            console.log('JWT Token in createToken', token);
            resolve (token);
        }); 
    })
}

const tokenCheck = async(token) =>{
    var data = await jwt.verify(token, 'secretKey', (err, authData) => {
        if(err){
            return {status: 0, message: 'Token not Found.', result: err}
        }else{
            return {status: 1, message: 'Valid Token.', result: authData}
        }
    });
    return data;
}

module.exports = {createToken, tokenCheck}