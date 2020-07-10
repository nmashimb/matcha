const express = require('express');
const app = express();
//const io = require('socket.io')(3001);

app.use(express.static('./public'));
app.use(express.static('./public/images'));

var mysql = require('mysql');

//body parser Middleware
//var urlencodedParsor= bodyParser.urlencoded({extended: false });


/*var geo = require('geolocation');

geo.getCurrentPosition(function (err, pos) {
  //if (err) throw err;
  console.log(pos);
});
*/
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "matcha"
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected 2!");
  con.query("CREATE DATABASE IF NOT EXISTS matcha", function (err, result){
    if (err) throw err;
    console.log("Database created");
    var sql = "CREATE TABLE IF NOT EXISTS userinfor(id INT(11) AUTO_INCREMENT PRIMARY KEY ,username VARCHAR(255), firstname VARCHAR(255), lastname VARCHAR(255), email VARCHAR(255), password VARCHAR(255), token VARCHAR(255), verified INT(1), online INT(1), bio VARCHAR(100), gender VARCHAR(10), preference VARCHAR(15), profile_pic VARCHAR(50), pictures VARCHAR(100), latitude VARCHAR(50), longitude VARCHAR(50), blocked int(1), date_of_birth Date, age INT(3), on_off_date VARCHAR(30),  score INT(2))";
    con.query(sql, function(err, result) {
      if (err) throw err;
      console.log("table userinfor created");
    })

    var sql = "CREATE TABLE IF NOT EXISTS tags(id INT(11) AUTO_INCREMENT PRIMARY KEY ,userid INT(11), tag VARCHAR(255))";
    con.query(sql, function(err, result) {
      if (err) throw err;
      console.log("table tags created");
    })

    var sql = "CREATE TABLE IF NOT EXISTS pics(id INT(11) AUTO_INCREMENT PRIMARY KEY ,userid INT(11), name VARCHAR(255))";
    con.query(sql, function(err, result) {
      if (err) throw err;
      console.log("table pics created");
    })

    var sql = "CREATE TABLE IF NOT EXISTS connections(id INT(11) AUTO_INCREMENT PRIMARY KEY, u1 INT(11), u2 INT(11) ,status VARCHAR(255), liker INT(11))";
    con.query(sql, function(err, result) {
      if (err) throw err;
      console.log("table connections created");
    })

    var sql = "CREATE TABLE IF NOT EXISTS notifications(id INT(11) AUTO_INCREMENT PRIMARY KEY, userid INT(11) ,reason VARCHAR(255), senderid INT(11), nread int(1), username VARCHAR(50))";
    con.query(sql, function(err, result) {
      if (err) throw err;
      console.log("table notifcations created");
    })

    var sql = "CREATE TABLE IF NOT EXISTS chats(id INT(11) AUTO_INCREMENT PRIMARY KEY, connectionid INT(11) , message VARCHAR(255), senderid INT(11), recusername VARCHAR(50), readm int(1))";
    con.query(sql, function(err, result) {
      if (err) throw err;
      console.log("table chats created");
    })

  });
});

 