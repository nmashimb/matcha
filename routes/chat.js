const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var urlencodedParsor = bodyParser.urlencoded({extended: false});
var expressSession = require('express-session');
var sessions = require('express-session');
var func = require("../config/functions");
var sendmail = require('sendmail')();
//var app  = require('../app.js');
//var io = require('io');
///var socket = require('io');
//var socket = io();

express.static(__dirname + "/socket.io/socket.io.js");

router.use(sessions({
    key: 'user_id',
    secret: 'stuff@321-0i123',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: 600000
    }
}));

router.get('/update', (req, res) =>{
    var session = req.session;
    func.enqp("SELECT * FROM chats WHERE recusername = '"+session.userid+"' AND readm='"+"0"+"'").then((resul, err)=>{
        if (err) throw err;
        console.log(resul.length);
        res.writeHead(200);
        res.write(JSON.stringify(resul.length));
        res.end();
   })
   return
})
//browsing
router.get('/connections', (req, res) =>{
    var session = req.session;
    func.enqp("SELECT * FROM userinfor").then((users) => {
        if (users){
            users.forEach(function(row){
                if (row["username"] == session.userid){
                    var curr_user = row;
                    res.render('chat', {users, curr_user:curr_user});
                   //res.sendFile('chat.html');
                }
            });
        }
    });
});

module.exports = router;