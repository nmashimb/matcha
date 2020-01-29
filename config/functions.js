const express = require('express');
const app = express();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

/*var user;

module.exports.getUser = function(username, next){
    const result = MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db, next) {
        if (err) throw err;
        var dbo = db.db('matcha');
        var resul = dbo.collection('users').findOne({username: username}, (err, res, next) => {
            console.log('1');
            console.log(res);
            user = res;
            return res;
        });
        next();
        console.log('2 '+ user);
        return resul;
    });
    next();
    console.log('3 '+ result);
    return (result);
};*/