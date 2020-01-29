const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParsor = bodyParser.urlencoded({extended: false });
var user = require('../config/functions');


///GETS
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
    if (session.userid === undefined){
        res.end("You are not a user");
    }
    else{ 
        res.render('myprofile', {user: {username: session.userid}});
    }
});

///POSTS

module.exports = router;