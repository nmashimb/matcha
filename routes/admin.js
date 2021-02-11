const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var urlencodedParsor = bodyParser.urlencoded({extended: false});
var expressSession = require('express-session');
var sessions = require('express-session');
var session;
var func = require("../config/functions");
var sendmail = require('sendmail')();
const url = require('url');
var getAge = require('get-age');
const { getTestMessageUrl } = require('nodemailer');
const { profile } = require('console');


router.get('/', (req, res, next) => {
    var session = req.session;
    if (!session.userid){ 
        res.render('admin');
    }
    res.end('You have to log out first!');
});

