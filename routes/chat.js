const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var urlencodedParsor = bodyParser.urlencoded({extended: false});
var expressSession = require('express-session');
var sessions = require('express-session');
var func = require("../config/functions");
var sendmail = require('sendmail')();
var mysql = require('mysql'); 
var multer = require('multer');
const helpers = require('../routes/helpers');
const path = require('path');
const url = require('url');
const app = express();
var GeoPoint = require('geopoint');
var getAge = require("get-age");
const geoIp = require('geoip-lite');
const requestIp = require('request-ip');
const { exit } = require('process');
const { isIP } = require('net');
const { Session } = require('inspector');
const { count } = require('console');
var ip = require('ip');
const { isBuffer } = require('util');
express.static(__dirname + "/socket.io/socket.io.js");
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "matcha"
});
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

   
    



 func.enqp("SELECT * FROM chats WHERE recusername = '"+session.uid+"' AND readm='"+"0"+"'").then((resul, err)=>{
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
    
    func.enqp("SELECT * FROM userinfor WHERE id='"+session.uid+"'").then((curr_user, err) => {
        if (err) throw err;
        if (curr_user){
            res.render('chat', {curr_user:curr_user});
        }
    });
});


router.get('/reports', urlencodedParsor, (req, res) => {
    var session = req.session;
   
        func.enqp("SELECT * FROM reports WHERE reason = 'report'").then((re) => {
            func.enqp("SELECT * FROM userinfor").then((z) => {
                var i = "";
                z.forEach(u => {
                    var c = 0;
                    re.forEach(e => {
                        if(e["userid"] == u["id"])
                            c++;
                    });
                    if(c > 0)
                        i = i + "<div> <img src='../"+u['profile_pic']+"' style='border-radius: 50%;width:50px;height:50px;padding: 10px;'>"+u["username"]+"   has been reported "+c+" time <FORM style='float:left;padding-top: 15px' action='/loggedin/chat/drop?id="+u["id"]+"' method='post'><BUTTON type= 'submit'>click to remove profile</BUTTON></FORM>  </div>";
                });
                res.writeHead(200);
                res.write(i);
                res.end();
            })
        })
        return
});

router.post('/drop', urlencodedParsor, (req, res) => {
    console.log("lululululullu");
    const current_url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    console.log(current_url);
    const search_params = current_url.searchParams;
    var id = search_params.get('id');
    console.log(id);
    /*
        *do not forget to relpace the userid= id int the enq sql statemant 
    */ 
    func.enq("DELETE FROM `reports` WHERE userid="+id);
    res.redirect('../../users/admin');
});

module.exports = router;