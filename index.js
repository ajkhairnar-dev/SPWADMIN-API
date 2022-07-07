require('dotenv').config()
const express = require("express")
const cors = require("cors")
const app = express()
const port = process.env.PORT || 3000
global.conn = require("./src/v1/config/dbconnection");
global._ = require('underscore');
global.q = require('q');
global.basepath='/v1/admin'
app.use(cors())
app.use(express.json());
const { verifyApiKey} = require('./src/v1/common/verifyapikey')

const auth = require("./src/v1/route/auth.route")
const material = require("./src/v1/route/material.route")

app.use(verifyApiKey)
app.use(auth)
app.use(material)

app.get('*', function(req, res){
    return res.status(400).send("Authentication failed.")
});

app.listen(port, () => console.log(`server run on Port :${port}!`))
