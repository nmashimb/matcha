const express = require('express');
const app = express();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var sendmail = require('sendmail')();

// verify account

module.exports.verifyaccount = function (token) {
    MongoClient.connect(url, { useUnfiedTopology : true } ,function(err, db) {
        if (err) throw err;
        var dbo =db.db('matcha');
        var qry = {token : token};
        var nqry = {$set : {token : "" , verified : 1}};
        dbo.collection('users').updateOne(qry, nqry, function(err, res) {
            if (err) throw err;
            console.log(res);
            db.close();
        });
    });
}

        //check for user exists
module.exports.userExists = function (em) {
    return new Promise(function(resolve, reject) {
        MongoClient.connect(url, { useUnifiedTopology: true },function(err, db) {
            if (err) throw err;
            var dbo = db.db('matcha');
            dbo.collection("users").findOne({email : em}, function(err, result) {
                if (err) throw err;
                resolve(result);
            });
        });
    });
}
        //insert new user
module.exports.userInfo = function (userI){

    MongoClient.connect(url, { useUnifiedTopology: true },function(err, db) {
        if (err) throw err;
        var dbo = db.db('matcha');
        dbo.collection("users").insertOne(userI, function(err, result) {
            if (err) throw err;
            sendmail({
                from: 'register@matcha.co.za',
                to : userI.email,
                subject : 'Verify Your Matcha Account',
                html: `Thank you for creating a Matcha account, click the link to to verify<p><a href=http://localhost:3000/users/verify?token=` + userI.token +`>verification</a></p>`
            }, function(err, reply) {
                console.log(err && err.stack);
                console.dir(reply);
            });
        });
    });

}