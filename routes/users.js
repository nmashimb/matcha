const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var urlencodedParsor = bodyParser.urlencoded({extended: false});
var expressSession = require('express-session');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var nodemailer = require('nodemailer');
var sessions = require('express-session');
var session;

/*things left: sending email, redirect sys when user exists(synchro), validate username, name, lastname and password*/ 

//router.use(cookieParser());
router.use(sessions({
    key: 'user_id',
    secret: 'stuff@321-0i123',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: 600000
    }
}));

//login page
router.get('/login', (req, res, next) => {
    var session = req.session;
    if (!session.userid){
        res.render('login');
    }
    res.end('You have to log out first!');
});


//register page
router.get('/register', (req, res) => {
    var session = req.session;
    if (session.userid === undefined){
        res.render('register');
    }
    res.end('You have to log out first!');
});

router.get('/logout', (req, res) =>{
    var session = req.session;
    req.session.destroy();
    session.id = null;
    res.redirect('/users/login');
});

//Register handle(POST): handles data
router.post('/register', urlencodedParsor, (req, res) => {
    var session = req.session;
    
    var {username, firstname, lastname, email, password, passwordc} = req.body;
    //let errors = [];
    if (!username || !firstname || !lastname || !email || !password || !passwordc){
        //errors.push({msg: 'Please fill in all fields!'});
        res.redirect('/users/register?registration=fieldsincomplete');
        return;
    }
    if (password !== passwordc){
        //errors.push({msg: 'Passwords do not match!'}); //how to make push work?
        res.redirect('/users/register?registration=passwordsdontmatch');
        return;
    }
    if (password.length < 6){
        //errors.push({msg: 'Password should be at least 6 characters!'});
        res.redirect('/users/register?registration=passwordshort');
        return;
    }
    /*else{
        //check if theres numbers, characters, upper and lowercase
        var hasNumber = /\d/;
        if (hasNumber.test(req.body.userormail) == false){}
    }
    if (errors.length > 0){
        res.render('register', {
        errors, 
        username, 
        firstname, 
        lastname, 
        email
    });
    }*/
        ////////VALIDATION  PASSED
    MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db('matcha');  //checking user by email for now!!!!!!
        dbo.collection("users").findOne({email: email}, function(err, user) {
            if (err) throw err;
            if (user){
                console.log('user exists');
                db.close();
                res.redirect('/users/register?registration=userexists');//FIND A WAY TO END OR REDIRECT IF USER EXISTS
                return;
                }
        });
        password = bcrypt.hashSync(password, 10);
        var token = bcrypt.hashSync(passwordc + Date.now(), 10);
        dbo.collection("users").insertOne(//change verified value after working on sending email.
            {username: username, firstname: firstname, lastname: lastname, email: email, password: password, token: token, verified: 1}, 
            function(err, result) {
                if (err) throw err
                console.log("user document inserted");
                db.close();
                //////////////////SENDING EMAIL/////////////////////
                /*var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'matcha@gmail.com',
                        pass: 'yourpassword'
                    }
                });  
                var mailOptions = {
                    from: 'matcha@gmail.com',
                    to: email,
                    subject: 'Verify Your Matcha Account',
                    text: 'Thank you for creating a Matcha account, click the link to to verify'
                };
                
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('Email sent: ' + info.response);
                    }
                });*/
                //////////////////////////////////////////////////
                res.redirect('/users/login?login=successful&verificationmail=sent');
        });
    });
});


//Login handle(POST): handles data
router.post('/login', urlencodedParsor, function(req, res) {
    var session = req.session;
    MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
        var dbo = db.db('matcha');
        dbo.collection('users').findOne({ username: req.body.userormail}, function(err, user) {
            if (err) throw err;
            if(user === null) {
                res.redirect('/users/login?login=incorrectusername');
                return;
            }
            else if (user.username === req.body.userormail) {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    if (user.verified === 1){
                        session.userid = user.username;
                        session.userEmail = user.email;
                        res.redirect('/loggedin/home');
                    }
                    else{
                        console.log("User not verified!");
                        res.redirect('/users/login?login=verifyaccount');
                        return;
                    }
                }
                else {
                    console.log("Credentials wrong");
                    res.redirect('/users/login?login=wrongpassword');
                   }        
            }
        });
    });
});

module.exports = router;