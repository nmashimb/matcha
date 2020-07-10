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

router.use(sessions({
    key: 'user_id',
    secret: 'stuff@321-0i123',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: 600000
    }
}));

//browsing
router.get('/', (req, res) =>{
    var session = req.session;
    if (!session)
        res.send('logout first!');
    console.log(session.userid);
    func.SelectQ("SELECT * FROM userinfor WHERE username = '" + session.userid +"'").then((user, err) => {
        if (err)
            throw err;
        var user = user[0];
        if (!user['gender'] || !user['preference'] || !user['bio'] || user['profile_pic'] == 'profile_pic-blankprofile.png'){
            var profile = 'incomplete';
            var msg = 'Please complete your profile to get full access to the site!';
        }
        else{
            var profile = 'complete';
            var msg = '';
        }
        res.render('search', {user:user, profile:profile, msg:msg});
    });
});

module.exports = router;