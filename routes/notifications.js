const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParsor = bodyParser.urlencoded({extended: false });
var user = require('../config/functions');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var func = require("../config/functions");


router.get('/read', urlencodedParsor, (req, res, next) => {
    var session = req.session;
    const current_url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;
    var message = search_params.get('message');
    
   func.enqp("SELECT * FROM notifications WHERE userid = '"+session.uid+"' AND nread='"+"0"+"'").then((resul, err)=>{
        if (err) throw err;
        console.log(resul.length);
        res.writeHead(200);
        res.write(JSON.stringify(resul.length));
        res.end();
   })
   return
});

router.get('/', (req, res) => {
    var session = req.session;
    
    func.SelectQ("SELECT * FROM userinfor WHERE username = '" + session.userid +"'").then((user, err) => {
        if (err) throw err;
        if (user){
            var user = user[0];
            func.enqp("SELECT * FROM notifications WHERE userid= '"+session.uid+"'").then((notif, err) =>{
                if (err) throw err;
                func.enq("UPDATE notifications SET nread = '"+1+"' WHERE userid = '"+session.uid+"' AND nread='"+0+"'");
                res.render('notifications', {user: user, notif: notif});
            });   
        }
        else
            throw err;
    });
});

module.exports = router;