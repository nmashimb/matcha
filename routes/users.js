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

/*things left: sending email, redirect sys when user exists(synchro), validate username, name, lastname and password*/ 

//router.use(cookieParser());

router.get('/viewchat', (req, res, next) => {
    var session = req.session;
    if (!session.userid){ 
        res.render('viewchat');
    }
    res.end('You have to log out first!');
});

router.get('/reset', (req, res, next) => {
    var session = req.session;
    if (!session.userid){ 
        res.render('sendEmail');
    }
    res.end('You have to log out first!');
});

router.post('/reset', urlencodedParsor, (req, res) => {
    console.log('sss '+ req.body.email);
    var email = req.body.email;
    func.EmailExists("SELECT * FROM userinfor WHERE email = '" + email + "'").then((resul) => {
        if (!(resul[0] == undefined)){
            var token = bcrypt.hashSync(email + Date.now(), 10);
            func.enq("UPDATE userinfor SET token = '"+token+"' WHERE email = '" + email+ "'");
            subject = "Matcha: Reset your password";
            html = `Click the link to <a href=http://localhost:5000/users/resetform?token=` + token +`>reset your password</a>`;
            func.sendEmail(email, subject, html);
            res.send('Check your emails for the form link!');
            exit;   
        }else
            res.redirect("/users/reset?email=notfound");
    });
});

router.get('/resetform', (req, res) => {
    var session = req.session;
    const current_url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;
    var token = search_params.get('token');
  //  if (session){   
        res.render('newpassword', {token : token});
  //  }
    res.end('You have to log out first!');
});

router.post('/resetform', urlencodedParsor, (req, res) => {
    var session = req.session;
    const current_url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;
    var token = search_params.get('token');
    if (!session.userid){   
        if (req.body.pass == req.body.pass){
            if (!(req.body.pass.length < 6)){
                var hasNumber = /\d/;
                if (hasNumber.test(req.body.pass) == true){ //check has digits too
                    var newpassword = bcrypt.hashSync(req.body.pass, 10);
                    func.enqp("UPDATE userinfor SET password = '"+newpassword+"' WHERE token = '" + token+ "'");
                    res.redirect("/users/login?password=changed");
                }
                else
                    res.redirect('/users/resetform?password=weak');
            }
            else
                res.redirect('/users/resetform?password=short');
            
        }
        else
            res.redirect('/users/resetform?password=dontmatch');
    } 
});

//browsing
router.get('/people', (req, res) =>{
    var session = req.session;
    
    func.userMatch().then((resul) => {
        if (resul)
            res.redirect('/users/people?matches='+ resul);
    });
});

router.get('/logout', (req, res) =>{
    var session = req.session;
    var id = session.uid;
    let dateObj = new Date();
    let date = ("0"+dateObj.getDate()).slice(-2);
    let month = ("0"+(dateObj.getMonth() + 1)).slice(-2);
    let year = dateObj.getFullYear();
    let hours = dateObj.getHours();
    let min = dateObj.getMinutes();
    let sec = dateObj.getSeconds();
    let time = hours+':'+min+':'+sec+' '+date+'-'+month+'-'+year;
    
    func.onlineOffline(0, session.userid).then((user, err) => {
        if (err)
            throw err;
        func.enq("UPDATE userinfor SET on_off_date = '"+time+"' WHERE id='"+id+"'");
    });
    req.session.destroy();
    session.id = null;
    res.redirect('/users/login');
});

router.get('/verify',(req, res) =>{
    func.verifyaccount(req.query.userormail,req.query.token);
    res.redirect('/users/login?verification=successful');  
});

router.get('/register', (req, res) => {
    var session = req.session;
    if (session.userid === undefined){
        res.render('register');
    }
    res.end('You have to logout first!');
});

router.post('/register', urlencodedParsor, (req, res) => {
    var session = req.session;
    var hasNumber = /\d/;
    var hasSpcialChr = /[`!@#$%^&*()_+\[\]{};':"\\|,.<>\/?~]/;
    var {username, firstname, lastname, dob, email, password, passwordc} = req.body;

    if (getAge(dob) < 18)
        res.redirect('/users/register?registration=underage');
    else if (!username || !firstname || !lastname || !email || !password || !passwordc || !dob)
        res.redirect('/users/register?registration=fieldsincomplete');
        if (password !== passwordc)
        res.redirect('/users/register?registration=passwordsdontmatch');
    else if (password.length < 6)
        res.redirect('/users/register?registration=passwordshort');
    else if (hasNumber.test(req.body.password) == false || hasSpcialChr.test(password) == false)
        res.redirect('/users/register?registration=passwordweak');
    else{
        func.userExists(username, email).then((resul) => {
            if (resul.length){
                res.redirect('/users/register?registration=userexists');
                return;
            }else{
                var token = bcrypt.hashSync(passwordc + Date.now(), 10);
                password = bcrypt.hashSync(password, 10);
                var v = 1; //CHANGE ME TO 0
                var userInfo = {username: username, firstname: firstname, lastname: lastname, email: email, password: password, token: token, verified: v, dob:dob, age: getAge(dob)};
                func.userInfo(userInfo);
                func.enq("UPDATE userinfor SET profile_pic = '"+"profile_pic-blankprofile.png"+"' WHERE  username = '" +username+ "'");
                res.redirect('/users/login?login=successful&verificationmail=sent');        
            }
        });
    }
});

router.get('/login', (req, res, next) => {
    var session = req.session;
    if (!session.userid){   
        res.render('login');
    }
    res.end('You have to logout first!');
});

router.post('/login', urlencodedParsor, (req, res) => {
    var session = req.session;
    let dateObj = new Date();
    let date = ("0"+dateObj.getDate()).slice(-2);
    let month = ("0"+(dateObj.getMonth() + 1)).slice(-2);
    let year = dateObj.getFullYear();
    let hours = dateObj.getHours();
    let min = dateObj.getMinutes();
    let sec = dateObj.getSeconds();
    let time = hours+':'+min+':'+sec+' '+date+'-'+month+'-'+year;

    func.useraccount(req.body.userormail).then((user) => {
        if(user[0] === undefined) {
            res.redirect('/users/login?login=incorrectusername');
            return;
        }
        else if (user[0]["username"] === req.body.userormail){
            if (bcrypt.compareSync(req.body.password,user[0]["password"])) {
                if (user[0]["verified"] === 1){
                    var user = user;
                    if (user[0]["pictures"] != undefined)
                        var pics = user[0]["pictures"].split(";");
                    else
                        var pics = user[0]["pictures"];
                    session.userid =user[0]["username"];
                    session.userEmail = user[0]["email"];
                    session.uid = user[0]["id"];
                    func.onlineOffline(1, user[0]["username"]).then((userr) => {});
                    func.enq("UPDATE userinfor SET on_off_date = '"+time+"' WHERE username='"+session.userid+"'");
                    if (!user[0]['gender'] || !user[0]['preference'] || user[0]['profile_pic'] == 'profile_pic-blankprofile.png') //PICTURES
                    {
                        res.render('myprofile', {user:  user[0], pics: pics, msg: 'Please complete your profile to get full access to the site!', profile: "incomplete"});}
                    else
                        res.redirect('/loggedin/home');   
                }
                else
                    res.redirect('/users/login?login=verifyaccount');
            }
            else
                res.redirect('/users/login?login=wrongpassword'); 
        }
        else if (user[0]["email"] === req.body.userormail){
            if (bcrypt.compareSync(req.body.password,user[0]["password"])) {
                if (user[0]["verified"] === 1){
                    var user = user;
                    if (user[0]["pictures"] != undefined)
                        var pics = user[0]["pictures"].split(";");
                    else
                        var pics = user[0]["pictures"];
                        session.uid = user[0]["id"];
                    session.userid =user[0]["username"];
                    session.userEmail = user[0]["email"];
                    func.onlineOffline(1, user[0]["username"]).then((user) => {});
                    func.enq("UPDATE userinfor SET on_off_date = '"+time+"' WHERE username='"+session.userid+"'");
                    if (!user[0]['gender'] || !user[0]['preference'] || user[0]['profile_pic'] == 'profile_pic-blankprofile.png')
                        res.render('myprofile', {user:  user[0], pics: pics, msg: 'Please complete your profile to get full access to the site!'});
                    else
                        res.redirect('/loggedin/home');
                }
                else{
                    res.redirect('/users/login?login=verifyaccount');
                    return;
                }
            }
            else
                res.redirect('/users/login?login=wrongpassword');     
        }
    });
});

module.exports = router;