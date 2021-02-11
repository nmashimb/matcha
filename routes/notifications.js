const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParsor = bodyParser.urlencoded({extended: false });
var user = require('../config/functions');
var func = require("../config/functions");
var mysql = require('mysql'); 


router.get('/read', urlencodedParsor, (req, res, next) => {
    var session = req.session;
    const current_url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;
    var message = search_params.get('message');
    console.log('currrent ur;l  '+current_url);
   var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "matcha"
});
 
con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM notifications WHERE userid = '"+session.uid+"' AND nread='"+'0'+"'",function (err, resul) {
        if (err) throw err;
        res.writeHead(200);
        res.write(JSON.stringify(resul.length));
        res.end();  
    });
});

   return
});

router.get('/list', (req, res) => {
    var session = req.session;

    func.SelectQ("SELECT * FROM userinfor WHERE username = '" + session.userid +"'").then((user, err) => {
        if (err) throw err;
        if (user){
            var user = user[0];
            func.enqp("SELECT * FROM notifications WHERE userid= '"+session.uid+"'").then((notif, err) =>{
                if (err) throw err;
                func.enq("UPDATE notifications SET nread = '"+1+"' WHERE userid = '"+session.uid+"' AND nread='"+0+"'");
                res.render('notifications', {user:user, notif});
            });   
        }
        else
            throw err;
    });
});

module.exports = router;