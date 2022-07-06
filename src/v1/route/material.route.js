const express = require('express')
const material = express.Router()
const { getMeterial,addMaterial } = require('../controller/material/material.controller')
const {verifyAccessToken} = require('../common/jsonwebtoken');

material.get(basepath+'/getmaterial',getMeterial)
material.post(basepath+'/addmaterial',addMaterial)

module.exports = material

