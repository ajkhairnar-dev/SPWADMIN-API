const config = require("../config/config.json");
const jwt = require('jsonwebtoken');

const verifyApiKey = async(req,res,next) => {
    const apikey = req.headers['apikey'];
    if(apikey != config.apikey){
        return res.status(401).send({ success:false,message:"Authentication Fail.", errorCode:{},data:{}})
    }
    next()
}

module.exports = {
    verifyApiKey
}