const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParsor = bodyParser.urlencoded({extended: false });
var user = require('../config/functions');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

///GETS
router.get('/home', (req, res) => {
    var session = req.session;
    var username = session.userid;
   // if (session.userid){
        res.render('dashboard', {user: {username: username}});
   // }
 //   else {
    //    res.end("You are not a user");
 //   }
});

router.get('/myprofile', (req, res) => {
    var session = req.session;
    /*if (session.userid === undefined){
        res.end("You are not a user");
    }
    else{ */
        res.render('myprofile', {user: {username: session.userid}});
   // }
});

///POSTS
router.post('/myprofile', urlencodedParsor, (req, res) => {
    
    if (req.body.subbio){
        console.log(req.body.bio);
        var bio = req.body.bio;
        //using updateOne, insert bio in bio: 
        res.redirect('myprofile?');
    }

    else if (req.body.subgender){ //BIO/GENDER/PREFER
        console.log(req.body);
        var gender = req.body.gender;
        var sexualPref;
        if (req.body.males && req.body.females){
            sexualPref = 'bisexual';
            console.log(sexualPref);
        }
        else if (req.body.gender == 'male' && req.body.females){
            sexualPref = 'heterosexual';
            console.log(sexualPref);
        }
        else if (req.body.gender == 'male' && req.body.males){
            sexualPref = 'homosexual';
            console.log(sexualPref);
        }
        else if (req.body.gender == 'female' && req.body.males){
            sexualPref = 'heterosexual';
            console.log(sexualPref);
        }
        else if (req.body.gender == 'female' && req.body.females){
            sexualPref = 'homosexual';
            console.log(sexualPref);
        }
        res.redirect('myprofile?');
    }

    else if(req.body.subinterests){//INTERESTS
        //console.log(req.body);
        var interests = req.body.interest;
        console.log(interests);
        MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
            var dbo = db.db('matcha');
            dbo.collection("users").updateOne({username: 'nik'}, {$set: {'interests':interests}}); 
        });
        res.redirect('myprofile?');
    }

    else if(req.body.subusername){ 
        console.log(req.body);
        res.redirect('myprofile?');
    }

    else if(req.body.subfirstname){
        console.log(req.body);
        res.redirect('myprofile?');
    }

    else if(req.body.sublastname){
        console.log(req.body);
        res.redirect('myprofile?');
    }

    else if(req.body.subemail){
        console.log(req.body);
        res.redirect('myprofile?');
    }
    
    else if(req.body.subpassword){
        console.log(req.body);
        res.redirect('myprofile?');
    }
});


module.exports = router;