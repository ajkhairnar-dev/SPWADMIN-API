const config = require("../config/config.json");
const ecode = require('../common/error_codes.json');
const jwt = require('jsonwebtoken');

const generateAccessToken = async(token) => {
    try{
        return await jwt.sign(token, config.jwt.key,{ expiresIn: config.jwt.sessiontime });
    }catch(error){
        return res.status(400).send({ success:false,message:ecode.SYSA0001.msg, errorCode:ecode.SYSA0001.code,data:{}}) 
    } 
}

const verifyAccessToken = async(req,res,next) => {
    try{
        const bearerHeader = req.headers['authorization'];
        if(typeof bearerHeader !== 'undefined'){
            const bearer = bearerHeader.split(' ');
            const token = bearer[1];
            await jwt.verify(token, config.jwt.key);
            next()
        }else{
            return res.status(400).send({ success:false,message:ecode.SYSA0001.msg, errorCode:ecode.SYSA0001.code,data:{}})
        }
    }catch(error){
        return res.status(400).send({ success:false,message:ecode.SYSA0002.msg, errorCode:ecode.SYSA0002.code,data:{}})
    }
}


module.exports = {
    generateAccessToken,
    verifyAccessToken
}