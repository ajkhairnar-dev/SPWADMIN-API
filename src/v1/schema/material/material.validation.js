const { addmaterial,deletematerial,changematerialstatus,editmaterial } = require('./material.schema')

const addmaterialValidation = async (req,res,next) => {
    const value= await addmaterial.validate(req.body);
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

const deletematerialValidation = async (req,res,next) => {
    const value= await deletematerial.validate(req.body);
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

const changematerialstatusValidation = async (req,res,next) => {
    const value= await changematerialstatus.validate(req.body);
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


const editmaterialValidation = async (req,res,next) => {
    const value= await editmaterial.validate(req.body);
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
    addmaterialValidation,
    deletematerialValidation,
    changematerialstatusValidation,
    editmaterialValidation
}