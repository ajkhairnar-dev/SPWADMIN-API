const express = require('express')
const auth = express.Router()
const { login } = require('../controller/auth/login.controller')
const {loginValidation } = require('../schema/auth/login.validation');

//-------- login -----------
auth.post(basepath+'/login',loginValidation, login)


module.exports = auth

