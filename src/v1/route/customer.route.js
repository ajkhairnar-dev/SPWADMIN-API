const express = require('express')
const customer = express.Router()
const { getCustomers } = require('../controller/customer/customer.controller')

//-------- login -----------
customer.post(basepath+'/getcustomer',getCustomers)


module.exports = auth

