const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParsor = bodyParser.urlencoded({extended: false });
var user = require('../config/functions');

router.get('/home', (req, res) => {
    var session = req.session;
    var username = session.userid;
    if (session.userid){
        res.render('dashboard', {user: {username: username}});
    }
    else {
        res.end("You are not a user");
    }
});

router.get('/myprofile', (req, res) => {
    var session = req.session;
    var userinfor = user.getUser(req.session.userid);
    console.log(userinfor);
    res.render('myprofile', {user: {username: session.userid}});
});
module.exports = router;