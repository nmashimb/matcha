const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParsor = bodyParser.urlencoded({extended: false });
var user = require('../config/functions');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var func = require("../config/functions");

router.get('/', (req, res) => {

    var notif = [{user: 'user1',action: 'liked'},
                {user: 'user2',action: 'unliked'}, 
                {user: 'user3',action: 'messaged'}];
    
    notif.push({user: 'user4', action: 'messaged'});
    console.log(notif);
    res.render('notifications', {notifications: {notif}});
    //{user: {username: session.userid}}
});

module.exports = router;