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
const { Session } = require('inspector');
const { exit, nextTick } = require('process');


router.post('/', urlencodedParsor, (req, res, next) => {
    var session = req.session;
    const current_url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;
    var id = search_params.get('id');
    var pic = search_params.get('pic');

    console.log(req.body);
    console.log(req.body.like);
    if (req.body.chat != undefined){
        res.redirect('/loggedin/chat/connections');
    }
    if (pic == 'profile_pic-blankprofile.png'){
        res.redirect("/loggedin/viewprofile?id="+id+"&error=uploadprofilepic");
        exit;
    }else if (req.body.like != undefined) {   
        func.enqp("SELECT * FROM connections  WHERE u1 = '"+session.uid+"' AND u2 = '"+id+"' OR u1 = '"+id+"' AND u2 = '"+session.uid+"'").then((resul) => {
           if(resul[0] == undefined)
           {
            func.enq("INSERT INTO connections  (u1,u2,liker,status ) values('"+session.uid+"','"+id+"','"+session.uid+"', 'not connected')");
            next();
            func.enq("INSERT INTO notifications(userid, reason, senderid, nread, username) VALUES ('"+id+"','"+req.body.like+"','"+session.uid+"','"+0+"', '"+session.userid+"')");
            console.log("created a connection");
            res.redirect("/loggedin/viewprofile?id="+id+"&like=true");
        }
           else if(resul[0]['liker'] != session.uid){
               func.enq("UPDATE `connections` SET `status`= 'connected'  WHERE u1 = '"+session.uid+"' AND u2 = '"+id+"' OR u1 = '"+id+"' AND u2 = '"+session.uid+"'");
               next();
               func.enq("INSERT INTO notifications(userid, reason, senderid, nread, username) VALUES ('"+id+"','"+"liked you back"+"','"+session.uid+"','"+0+"','"+session.userid+"')");
               res.redirect("/loggedin/viewprofile?id="+id+"&users=connected");
            }
        });
    }
    else if (req.body.dislike != undefined){
        func.enqp("DELETE FROM connections WHERE u1 = '"+id+"' AND  u2 = '" +session.uid+ "' OR u1 = '"+session.uid+"' AND  u2 = '" +    id+ "'");
        next();
        func.enq("INSERT INTO notifications(userid, reason, senderid, nread, username) VALUES ('"+id+"','"+req.body.dislike+"','"+session.uid+"','"+0+"','"+session.userid+"')");
        res.redirect("/loggedin/viewprofile?id="+id+"&dislike=success");
    }
    else if (req.body.block != undefined){
        func.enqp("INSERT INTO reports (userid,reporter, reason) VALUES ('"+id+"','"+session.uid+"','report')");
        res.redirect("../loggedin/home");  
    }
    else if (req.body.report != undefined){
        func.enqp("INSERT INTO reports (userid,reporter, reason) VALUES ('"+id+"','"+session.uid+"','report')");
        res.redirect("../loggedin/home");  
    }
});

module.exports = router;