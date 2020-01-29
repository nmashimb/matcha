const express = require('express');
const app = express();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
//body parser Middleware
//var urlencodedParsor= bodyParser.urlencoded({extended: false });

exports = MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
  if (err) throw err;
  var dbo = db.db('matcha');
  dbo.createCollection('users', function(err, res){
      if (err) throw err;
      console.log('Collection created!');
      db.close();
  });
  console.log("Database created!");
});
