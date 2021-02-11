require('../config/server');
var url = "mongodb://localhost:27017/";
const MongoClient = require('mongodb').MongoClient;


var userDocument = MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
  if (err) throw err;
  var dbo = db.db("matcha");
  /*var myObj = {username: body.username, firstname: body.firstname, lastname: body.lastname, email: body.email, password: body.password};
  dbo.collection("users").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });*/
});

//27min 51min
/*var insertUserDoc = function(db, callback) {
    //get the user collection
    var collection = db.collection('users);
    //insert some documents
    var myObj = {username: body.username, firstname: body.firstname, lastname: body.lastname, email: body.email, password: body.password};
    
};*/
