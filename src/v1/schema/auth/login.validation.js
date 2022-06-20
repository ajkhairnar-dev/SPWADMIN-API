const { login } = require('./login.schema')

const loginValidation = async (req,res,next) => {
    const value= await login.validate(req.body);
    if(value.error){
        res.status(400).send({
            success: false,
            message:value.error.details[0].message,
            data:{}
        })
    }else{
        next();
    }
}

module.exports = {
    loginValidation
}
