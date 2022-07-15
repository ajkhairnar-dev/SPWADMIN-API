const Joi = require('joi');

const materialSchema = {
    addmaterial : Joi.object({
        materialname: Joi.string().min(1).message("MaterialName is required.").required(),
        isactive:Joi.number().min(1).message("isActive is required.").required(),
        materialicon :{
            fileData:Joi.string().min(1).message("Filedata is required.").required(),
            fileExtension : Joi.string().min(1).message("fileExtension is required.").required(),
            fileName: Joi.string().min(1).message("fileName is required.").required(),
            fileSize:Joi.number().min(1).message("fileSize is required.").required(),
            fileType:Joi.string().min(1).message("fileType is required.").required()
        }
    }),
    deletematerial : Joi.object({
        materialid: Joi.number().min(1).message("Materialid is required.").required()
    }),
    changematerialstatus:Joi.object({
        materialid: Joi.number().min(1).message("Materialid is required.").required(),
        isactive: Joi.number().valid(0,1).required()
    }),
    editmaterial : Joi.object({
        materialid: Joi.number().min(1).message("Materialid is required.").required(),
        materialname: Joi.string().min(1).message("MaterialName is required.").required(),
        isactive:Joi.number().min(1).message("isActive is required.").required(),
        materialicon :{
            fileData:Joi.string().min(1).message("Filedata is required.").allow(null),
            fileExtension : Joi.string().min(1).message("fileExtension is required.").allow(null),
            fileName: Joi.string().min(1).message("fileName is required.").allow(null),
            fileSize:Joi.number().min(1).message("fileSize is required.").allow(null),
            fileType:Joi.string().min(1).message("fileType is required.").allow(null)
        }
    }),
}

module.exports = materialSchema;