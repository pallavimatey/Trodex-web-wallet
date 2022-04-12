const Joi = require('@hapi/joi');

const signTrxValidation = async (req, res, next) => {
    let { asset, withdrawalAddress, withdrawalAmount } = req.query;
    let userAddress = req.userAddress
    const schema = Joi.object({
        asset: Joi.string().pattern(new RegExp(/^([A-Za-z_-]*)/)).required(),
        withdrawalAddress: Joi.string().pattern(new RegExp(/^0x([A-Fa-f0-9]{40})$/)).message('Invalid Address.'),
        withdrawalAmount: Joi.number().min(0).required(),
        userAddress: Joi.string().pattern(new RegExp(/^0x([A-Fa-f0-9]{40})$/)).message('Invalid Address.')
    });

    let userdata = { asset, withdrawalAddress, withdrawalAmount, userAddress }
    const value = schema.validate(userdata)
    if (value.error) {
        res.json({
            success: 'notOk',
            message: value.error.details[0].message
        })
    } else {
        next();
    }
}



const addNetworkValidation = async (req, res, next) => {
    let { networkName, rpc, chainId, currencySymbol, blockExplorer } = req.query
    let userAddress = req.userAddress
    const schema = Joi.object({
        networkName: Joi.string().pattern(new RegExp(/^([A-Za-z_-]*)/)).required(),
        rpc: Joi.string().uri().required(),
        chainId: Joi.number().min(0).required(),
        currencySymbol: Joi.string().pattern(new RegExp(/^([A-Za-z_-]*)/)).message('Ivalid Symbol.').allow(''),
        blockExplorer: Joi.string().uri().allow(''),
        userAddress: Joi.string().pattern(new RegExp(/^0x([A-Fa-f0-9]{40})$/)).message('Invalid Address.')
    });
    let networkDetails = { networkName, rpc, chainId, currencySymbol, blockExplorer, userAddress }
    const value = schema.validate(networkDetails)
    if (value.error) {
        res.json({
            success: 'notOk',
            message: value.error.details[0].message
        })
    } else {
        next();
    }

}



module.exports = { signTrxValidation, addNetworkValidation }