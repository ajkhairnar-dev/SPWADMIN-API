const Joi = require('joi');

const login = {
    login : Joi.object({
        emailid:Joi.string().email().message('Please enter valid email id.').required(),
        password :Joi.string().min(6).required(),
    })
}

module.exports = login;
