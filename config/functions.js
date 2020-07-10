const express = require('express');
const app = express();
var sendmail = require('sendmail')();
var mysql = require('mysql'); 
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "matcha"
});

module.exports.SelectQ = function (sql) {
    return new Promise(function(resolve, reject) {
        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "matcha"
        });
        con.connect(function(err) {
            if (err) throw err;
            con.query(sql, function (err, result) {
                if (err) throw err;
                    resolve(result);
            });
        });
    });
}

module.exports.onlineOffline = function (onOff, username) {
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "matcha"
    });

    return new Promise(function(resolve, reject) {    
        con.connect(function(err) { 
            if (err) throw err;
            con.query("UPDATE userinfor SET online = '" + onOff + "' WHERE username = '"+username+"'",function (err, result) {
                if (err) throw err;
                    resolve(result);
            });
        });
    });
}

module.exports.sendEmail = function (email, subject, html) {
    con.connect(function(err){
        if (err) throw err;
        sendmail({
            from: 'resetpassword@matcha.co.za',
            to : email,
            subject : subject,
            html: html
        }, function(err, reply) {
            console.log(err && err.stack);
            console.dir(reply);
        });
    });
}

module.exports.EmailExists = function (sql) {
    return new Promise(function(resolve, reject){
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "matcha"
    });

    con.query(sql, function (err, result) {
        if (err) throw err;
        resolve(result);
    });});
}

module.exports.verifyaccount = function (username,token) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "matcha"
      });

    var sql = "UPDATE userinfor SET token = NULL WHERE  username = '" + username + "' AND token = '" + token + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
    });
}

//returns promise
module.exports.enqp = function (sql) {
    return new Promise(function(resolve, reject){
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "matcha"
    });

    con.query(sql, function (err, result) {
        if (err) throw err;
        resolve(result);
    });});
}
//no return

module.exports.enq = function (sql) {
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "matcha"
    });

    con.query(sql, function (err, result) {
        if (err) throw err;
    });
}
//matching accounts

module.exports.userMatch = function () {
    return new Promise(function(resolve, reject) {
        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "matcha"
        });
        con.connect(function(err) {
            if (err) throw err;
            con.query("SELECT * FROM userinfor ",function (err, result) {
                if (err) throw err;
                    resolve(result);
            });
        });
    });
}
        //check for user exists

module.exports.userExists = function (un,em) {
    return new Promise(function(resolve, reject) {
        var con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "matcha"
        });
        
        con.connect(function(err) { 
            if (err) throw err;
            con.query("SELECT * FROM userinfor WHERE username = '" + un + "' OR email = '" + em + "'",function (err, result) {
                if (err) throw err;
                    resolve(result);
            });
        });
    });
}

        // accout exist
        module.exports.useraccount = function (username) {
            return new Promise(function(resolve, reject) {
                var con = mysql.createConnection({
                    host: "localhost",
                    user: "root",
                    password: "",
                    database: "matcha"
                });

                con.connect(function(err) {
                    if (err) throw err;
                    con.query("SELECT * FROM userinfor WHERE username = '" + username + "' OR email = '" + username + "' ",function (err, result) {
                        if (err) throw err;
                            resolve(result);
                    });
                });
            });
        }
    
    
//insert new user
module.exports.userInfo = function (userI){
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "matcha"
      });
    con.connect(function(err){
        if (err) throw err;
        var sql = "INSERT INTO userinfor (username, firstname, lastname, email, password, token, verified,date_of_birth, preference, profile_pic,age) VALUES ('"+ userI.username +"','"+ userI.firstname +"','"+ userI.lastname +"','"+ userI.email +"','"+ userI.password +"','"+ userI.token +"','"+userI.verified+"','"+userI.dob+"', 'bisexual','"+userI.pp+"','"+userI.age+"')";
        con.query(sql, function(err, result) {
            if (err) throw err;
            sendmail({
                from: 'register@matcha.co.za',
                to : userI.email,
                subject : 'Verify Your Matcha Account',
                html: `Thank you for creating a Matcha account, click the link to to verify<p><a href=http://localhost:5000/users/verify?token=` + userI.token +`>verification</a></p>`
            }, function(err, reply) {
                console.log(err && err.stack);
                console.dir(reply);
            });
        });
    });
}