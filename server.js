'use strict'

const express = require('express');
var routes = require('./routes/index.js');
const bodyParser = require('body-parser');
const aws = require('aws-sdk');

const app = express();
var port = 3000

app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

routes(app);

app.listen(port, function () {
    console.log('App running on ' + port + ' port.');
});
