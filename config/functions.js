const express = require('express');
const app = express();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

        //check for user exists
module.exports.userExists = function (em) {
    return new Promise(function(resolve, reject) {
        var r;
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
//insert nw user
module.exports.userInfo = function (userI){

    MongoClient.connect(url, { useUnifiedTopology: true },function(err, db) {
        if (err) throw err;
        var dbo = db.db('matcha');
        dbo.collection("users").insertOne(userI, function(err, result) {
            if (err) throw err;
        });
    });

}