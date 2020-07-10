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
const { Session } = require('inspector');
const { exit, nextTick } = require('process');




router.get('/', urlencodedParsor, (req, res, next) => {
    var session = req.session;
    const current_url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;
    var id = search_params.get('id');
   // var pic = search_params.get('pic');

res.render('viewchat', {id});

});

module.exports = router;