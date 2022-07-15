const express = require('express')
const material = express.Router()
const { getMeterial,addMaterial,deleteMaterial,changeMaterialStatus,editMaterial } = require('../controller/material/material.controller')
const { addmaterialValidation,deletematerialValidation,changematerialstatusValidation,editmaterialValidation} = require('../schema/material/material.validation');
const {verifyAccessToken} = require('../common/jsonwebtoken');

material.get(basepath+'/getmaterial',getMeterial)
material.post(basepath+'/addmaterial',addmaterialValidation,addMaterial)

material.post(basepath+'/editmaterial',editmaterialValidation,editMaterial)
material.post(basepath+'/deletematerial',deletematerialValidation,deleteMaterial)

material.post(basepath+'/changematerialstatus',changematerialstatusValidation,changeMaterialStatus)

module.exports = material

