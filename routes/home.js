const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var urlencodedParsor = bodyParser.urlencoded({extended: false});
var expressSession = require('express-session');
var sessions = require('express-session');
var multer = require('multer');
const helpers = require('../routes/helpers');
const path = require('path');
var func = require("../config/functions");
var sendmail = require('sendmail')();
var mysql = require('mysql');
const url = require('url');
const app = express();
var GeoPoint = require('geopoint');
var getAge = require("get-age");
const geoIp = require('geoip-lite');
const requestIp = require('request-ip');
const { exit } = require('process');
const { isIP } = require('net');
const { Session } = require('inspector');
const { count } = require('console');
var ip = require('ip');
const { isBuffer } = require('util');

app.use(express.json({limit: '1mb'}));

app.use(express.static('./public'));
app.use(express.static('./public/images'));
app.use(express.static('./public/scripts'));

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images');
    },
    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

//save messages

router.post('/save', urlencodedParsor, (req, res, next) => {
    var session = req.session;
    const current_url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;
    var id = search_params.get('id');
    var message = search_params.get('message');

    func.enqp("SELECT * FROM connections WHERE id ="+id).then( (resul, err) =>{
        if (err) throw err;
        if (resul[0]['u1'] == session.uid)
            var name = resul[0]['u2'];
        else
            var name = resul[0]['u1'];
        func.enq("INSERT INTO chats (connectionid, message, senderid, recusername, readm) VALUES ("+id+",'"+message+"',"+session.uid+", '"+name+"', "+0+")");
    });
return

});

// fetch messages

router.post('/messages', urlencodedParsor, (req, res, next) => {
    var session = req.session;
    const current_url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;
    var id = search_params.get('id');
  
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "matcha"
        });

        con.query("UPDATE  chats SET nread = '1'   WHERE connectionid ='"+id+"'", function (err, result) {

        })
        con.query("SELECT * FROM chats WHERE connectionid ='"+id+"'", function (err, result) {
            if (err) throw err;
            var i = "";
            result.forEach(e => {
                if (e['senderid'] == session.uid){
                    i = i + "<a><h4 style='color: blue;text-align:right;padding-right:5px'>"+e['message']+"</h4></a>"   
                }else{
                i = i + "<h4 style=';text-align:left;padding-left:5px'> "+e['message']+"</h4>"
                }
            });
            res.writeHead(200)
            res.write(i);
            res.end();
        });
return

});

//chats
router.get('/chatsread', urlencodedParsor, (req, res) => {
    var session = req.session;
    const current_url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;
    var id = search_params.get('id');

    func.enqp("UPDATE chats SET readm = "+1+" WHERE connectionid = '"+id+"' AND recusername = '"+session.uid+"'").then( (resul, err) =>{
       if (err) throw err;
        res.redirect('/loggedin/viewchat?id='+id);
    })
})
router.get('/chats', urlencodedParsor, (req, res) => {
    var session = req.session;

    func.enqp("SELECT * FROM connections WHERE u1 = '"+session.uid+"'  OR u2 = '"+session.uid+"' AND status  = 'connected'").then( (ss, err) =>{
     
        var i = "";
        if (ss[0]["id"] == undefined)
        {
            i = "you have no chats";
            res.writeHead(200)
               res.write(i);
               res.end();
        }
        else{
            var q ;
            ss.forEach(e => {
                if(e["u1"] == session.uid)
                {
                    if (q == undefined) {
                        q = " id = '"+ e["u2"]+"'";
                    }
                    else
                    q = q+ " OR id = '"+e["u2"]+"'"
                }
                else
                {   
                    if (q == undefined) {
                        q = " id = '"+ e["u1"]+"'";
                    }
                    else
                    q = q+ " OR id = '"+e["u1"]+"'"
                }
                 
            });
                    func.enqp("SELECT * FROM userinfor WHERE "+q).then( (dd, err) =>{
                        var v = "";
                        for (var j = 0; j < ss.length; j++) {
                           
                            for (let i = 0; i < dd.length; i++) {
                                if (ss[j]["u1"] == session.uid)
                                {
                                    if (ss[j]["u2"] == dd[i]["id"]) {
                                            v = v + "<br> <a href='/loggedin/chatsread?recusername="+ss[j]['recusername']+"&id="+ss[j]["id"]+"'><img src='/"+dd[i]['profile_pic']+"' style='border-radius: 50%;width:30px;height:30px'></a><h3>"+ dd[i]["username"] +"</h3></p>";
                                    }
                                }
                                else
                                {
                                    if (ss[j]["u1"] == dd[i]["id"]) {
                                        v = v + "<br> <a href='/loggedin/chatsread?recusername="+ss[j]['recusername']+"&id="+ss[j]["id"]+"'><img src='/"+dd[i]['profile_pic']+"' style='border-radius: 50%;width:30px;height:30px'></a><h3>"+ dd[i]["username"] +"<h5 style='color: blue';>online</h5></h3></p>";
                                    }
                                }

                            } 
                        }
                        res.writeHead(200)
                        res.write(v);
                        res.end();
                    })
        }
    })
    return
})


//notifications

router.get('/notifications', urlencodedParsor, (req, res) => {
    var session = req.session;


    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "matcha"
    });
    
    con.connect(function(err) { 
        if (err) throw err;
        con.query("SELECT * FROM notifications WHERE userid = '"+session.uid+"'",function (err, ss) {
            if (err) throw err;
            var q;
            var v = 0;
    
            ss.forEach(e => {
                if (q == undefined) {
                    q = " id = '"+e["senderid"]+"'";
                    
                } else {
                    q = q + " OR id = '"+e["senderid"]+"'";
                }
            })
            con.query("SELECT * FROM userinfor WHERE "+q,function (err, s) {
                var i = "";
            ss.forEach(e => {
                for (let c = 0; c < s.length; c++) {
                    const t = s[c];
    
                    if (t["id"] == e["senderid"])
                        i = i + "<div> <a href='/loggedin/viewprofile?id="+t['id']+"'><img src='/"+t['profile_pic']+"' style='border-radius: 50%;width:30px;height:30px'></a>"+e["username"]+"   "+e["reason"]+" your profile</div>"
                }
    
            });
            var s  = '<div> <FORM style="float:left;padding-top: 15px" action="/loggedin/myprofile"><BUTTON type= "submit">My Profile</BUTTON></FORM>'
                s += '<FORM style="float:left;padding-top: 15px" action="/loggedin/visits"><BUTTON type= "submit"> Visits</BUTTON></FORM>'
                s += '<FORM style="float:left;padding-top: 15px" action="/loggedin/notifications"><BUTTON type= "submit">Notifications <p id="not"> </p></BUTTON></FORM>'
                s += '<FORM style="float:left;padding-top: 15px" action="/loggedin/chat/connections"><BUTTON type= "submit">Chat <p id="c"></p></BUTTON></FORM>'
                s += '<FORM style="float:left;padding-top: 15px" action="/loggedin/search"><BUTTON type= "submit">Search</BUTTON></FORM>'
                s +='<FORM style="float:left;padding-top: 15px" action="/users/logout"><BUTTON type= "submit">Logout</BUTTON></FORM>'
                s += '</div><br /><br /><br /><div> notifications </div>' + i;
           res.writeHead(200)
           res.write(s);
           res.end();
            })





        });
    });

   /* func.enqp("SELECT * FROM notifications WHERE userid = '"+session.uid+"'").then( (ss, err) =>{
        var q;
        var v = 0;

        ss.forEach(e => {
            if (q == undefined) {
                q = " id = '"+e["senderid"]+"'";
                
            } else {
                q = q + " OR id = '"+e["senderid"]+"'";
            }
        })
        func.enqp("SELECT * FROM userinfor WHERE "+q).then( (s, err) =>{
            var i = "";
        ss.forEach(e => {
            for (let c = 0; c < s.length; c++) {
                const t = s[c];

                if (t["id"] == e["senderid"])
                    i = i + "<div> <a href='/loggedin/viewprofile?id="+t['id']+"'><img src='/"+t['profile_pic']+"' style='border-radius: 50%;width:30px;height:30px'></a>"+e["username"]+"   "+e["reason"]+" your profile</div>"
            }

        });
       res.writeHead(200)
       res.write(i);
       res.end();
        })
        
     
    })*/
    return
})

//reseach
router.get('/research', urlencodedParsor, (req, res) => {
    var session = req.session;
    const current_url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;
    var age = search_params.get('age');
    var tags = search_params.get('tags');
    var sort = search_params.get('sort');
    var gender = search_params.get('gender');
    var location = search_params.get('location');
    var popularity = search_params.get('popularity');

    function name(r,tags,sort,popularity,location) {
        func.enqp("SELECT * FROM tags WHERE userid = '"+session.uid+"'").then((resul) => {

            if(resul  === undefined)
            {

            }
            else{
              var i = 0;
              var utags;
                resul.forEach(function(tag){
                    i++;
                    if(utags === undefined)
                        utags = "tag ='"+tag["tags"]+"' ";
                    else
                        utags = utags +" OR tag = '"+tag["tag"]+"' ";
                    })
                    
                    if(utags) {
                        func.enqp("SELECT * FROM tags WHERE "+utags+" AND NOT id ='"+session.uid+"'").then((rl) => {
                            
                            var num=[];
                            var count=[];
                            i = 0 ;
                            r.forEach(function(tag){
                                count[i] = tag["id"];
                                num[i] = 0;
                                i++;
                            });
                            for (let i = 0; i < count.length; i++) { 
                                var c = 0;
                                rl.forEach(function(tag){
                                    if (count[i] == tag["userid"])
                                    c++;
                                });
                                num[i] = c;
                            }
                            var o;
                            var z = [];
                            var a = 0;
                            for (let i = 0; i < num.length; i++) {
                                if(num[i] >= tags)
                                {
                                    if(o === undefined)
                                        o = "id = '"+count[i]+"'";
                                    else
                                        o = o + " OR id = '"+count[i]+"'";
                                        z[a] = count[i];
                                        a++;
                                }
                            }
                            if (o === undefined)
                            {
                               var rr = [];
                                res.writeHead(200)
                                res.write(JSON.stringify(rr));
                                res.end();
                            }
                            else
                            {
                                o = o + " AND NOT id ='"+session.uid+"'";
                                var l = "";
                                if (sort == "age" || sort == "popularity" ){
                                    if (sort == "popularity")
                                        l =  " ORDER BY score DESC";
                                    else
                                        l = " ORDER BY "+sort+" DESC";
                                }
                                func.enqp("SELECT * FROM userinfor WHERE "+o + l).then((s) => {



                                    func.enqp("SELECT * FROM reports").then((reports) => {
                                        var t ;
                                        reports.forEach(r => {

                                            s.forEach(u => {
                                                if (r["userid"] == u["id"] || r["reporter"] == u["id"] ) {

                                                    if (r["userid"] == session.uid || r["reporter"] == session.uid ) {

                                                        for (let i = 0; i < z.length; i++) {
                                                            if (u["id"] == z[i]) {
                                                                z[i] = 0;
                                                            }
                                                            
                                                        }
                                                       
                                                    }
                                                    
                                                }
                                            });
                                            
                                        });

                                        for (let i = 0; i < z.length; i++) {
                                            if(z[i] > 0)
                                            {
                                                if(t === undefined)
                                                            t = " id = '"+z[i]+"'";
                                                        else
                                                            t = t + " OR id = '"+z[i]+"'";
                                            }
                                            
                                        }
                                        
                                        if (t != undefined ) {
                                            console.log(t)
                                            func.enqp("SELECT * FROM userinfor WHERE " + t + l).then((s) => {
                                                if (sort == "tag")
                                                {
                                                    var ss = [];
                                                    for (let i = 0; i < num.length; i++) {
                                                        for (let j = 0; j < num.length; j++) {
                                                            if(num[j] < num[i])
                                                            {
                                                                var h1 = num[i];
                                                                var h2 = count[i];
                                                                num[i] = num[j];
                                                                count[i] = count[j];
                                                                num[j] = h1;
                                                                count[j] = h2;
                                                            }
                                                        }
                                                    }
                                                    for (let i = 0; i < count.length; i++) {  
                                                        s.forEach(e => {
                                                            if(e["id"]  == count[i])
                                                            ss[i] = e;
                                                            
                                                        });
                                                    }
                                                    res.writeHead(200)
                                                    res.write(JSON.stringify(ss));
                                                    res.end();
                                                }
                                                else 
                                                {
                                                    func.enqp("SELECT  * FROM userinfor WHERE id = '"+session.uid+"'").then((sul) =>{
                                                        pointA = new GeoPoint(sul[0]['latitude'], sul[0]['longitude']);
                                                    for (let i = 0; i < s.length; i++) {
                                                        pointC = new GeoPoint(s[i]['latitude'], s[i]['longitude']);
                                                        for (let j = 0; j < s.length; j++) {
                                                            pointB = new GeoPoint(s[j]['latitude'], s[j]['longitude']);
                                                             if((pointA.distanceTo(pointB, true) | 0 ) > (pointA.distanceTo(pointC, true) | 0 ))
                                                            {
                                                                var h1 = s[i];
                                                                s[i] = s[j];
                                                                s[j] = h1;
                                                            }
                                                        }
                                                        
                                                    }
            
            
            
                                                    res.writeHead(200)
                                                    res.write(JSON.stringify(s));
                                                    res.end();
                                                    })
                                                    
                                                }   
                                            });
                                            
                                        }else
                                        {
                                            if (sort == "tag")
                                            {
                                                var ss = [];
                                                for (let i = 0; i < num.length; i++) {
                                                    for (let j = 0; j < num.length; j++) {
                                                        if(num[j] < num[i])
                                                        {
                                                            var h1 = num[i];
                                                            var h2 = count[i];
                                                            num[i] = num[j];
                                                            count[i] = count[j];
                                                            num[j] = h1;
                                                            count[j] = h2;
                                                        }
                                                    }
                                                }
                                                for (let i = 0; i < count.length; i++) {  
                                                    s.forEach(e => {
                                                        if(e["id"]  == count[i])
                                                        ss[i] = e;
                                                        
                                                    });
                                                }
                                                res.writeHead(200)
                                                res.write(JSON.stringify(ss));
                                                res.end();
                                            }
                                            else 
                                            {
                                                func.enqp("SELECT  * FROM userinfor WHERE id = '"+session.uid+"'").then((sul) =>{
                                                    pointA = new GeoPoint(sul[0]['latitude'], sul[0]['longitude']);
                                                for (let i = 0; i < s.length; i++) {
                                                    pointC = new GeoPoint(s[i]['latitude'], s[i]['longitude']);
                                                    for (let j = 0; j < s.length; j++) {
                                                        pointB = new GeoPoint(s[j]['latitude'], s[j]['longitude']);
                                                         if((pointA.distanceTo(pointB, true) | 0 ) > (pointA.distanceTo(pointC, true) | 0 ))
                                                        {
                                                            var h1 = s[i];
                                                            s[i] = s[j];
                                                            s[j] = h1;
                                                        }
                                                    }
                                                    
                                                }
        
        
        
                                                res.writeHead(200)
                                                res.write(JSON.stringify(s));
                                                res.end();
                                                })
                                                
                                            }
                                        }
                                    })


                                   
                                
                                
                                })
                            }
                            
                        })  
                    } 
                
            }
        })
    }
    age = age.split('-');
    location = location.split(" ")
    var l = location[0];
    if (gender == "all") {
        func.enqp("SELECT * FROM userinfor WHERE  age >= '"+age[0]+"' AND age <= '"+age[1]+"' AND score >='"+popularity+"' AND NOT id  = '"+session.uid+"'").then((r)=>{
            func.enqp("SELECT * FROM userinfor WHERE  id = '"+session.uid+"'").then((y) =>{
                var o;
                r.forEach(function(tag){
                    if(l === "any")
                    {
                        if(o === undefined)
                            o = "id = '"+tag["id"]+"'";
                        else
                            o = o + " OR id = '"+tag["id"]+"'";
                    }
                    else{
                        pointA = new GeoPoint(y[0]['latitude'], y[0]['longitude']);
                        pointB = new GeoPoint(tag['latitude'], tag['longitude']);
                        var dist = (pointA.distanceTo(pointB, true) | 0 ) ;
                        
                        if(dist < l || dist == l)
                        {
                            if(o === undefined)
                            o = "id = '"+tag["id"]+"'";
                        else
                            o = o + " OR id = '"+tag["id"]+"'";
                        }
                    }
                   

               })
               if(o  != undefined)
               {
                console.log('zzzzz  '+ o);
                func.enqp("SELECT * FROM userinfor WHERE "+ o).then((rr) =>{
                  name(rr,tags,sort,popularity,l);
                })
               }
               else
                name([],tags,sort,popularity,l);
             //  name(r,tags,sort,popularity,l);
            }
        )
            
           
        })
    }
    else{

        func.enqp("SELECT * FROM userinfor WHERE gender = '"+gender+"' AND age >= '"+age[0]+"' AND age <= '"+age[1]+"' AND score >='"+popularity+"' AND NOT id  = '"+session.uid+"'").then((r)=>{
            func.enqp("SELECT * FROM userinfor WHERE  id = '"+session.uid+"'").then((y) =>{
                var o;
                r.forEach(function(tag){

                    pointA = new GeoPoint(y[0]['latitude'], y[0]['longitude']);
                    pointB = new GeoPoint(tag['latitude'], tag['longitude']);
                    var dist = (pointA.distanceTo(pointB, true) | 0 );
                    if(dist < l || dist == l)
                    {
                        if(o === undefined)
                        o = "id = '"+tag["id"]+"'";
                    else
                        o = o + " OR id = '"+tag["id"]+"'";
                    }
                    console.log(tag["username"]+'  '+ dist);

               })
               if(o  != undefined)
               {
                console.log('zzzzz  '+ o);
                func.enqp("SELECT * FROM userinfor WHERE "+ o).then((rr) =>{
                  name(rr,tags,sort,popularity,l);
                })
               }
               else
                name([],tags,sort,popularity,l);
             //  name(r,tags,sort,popularity,l);
            }
        )
        })
    }
    return   
});


router.get('/visits', (req, res) => {
    var session = req.session;
    func.enqp("SELECT * FROM userinfor WHERE id = '"+session.uid+"'").then((user, err) => {
    if (err) throw err;
    func.SelectQ("SELECT senderid FROM notifications WHERE userid= '"+session.uid+"'AND (reason= '"+"visited"+"' OR reason= '"+"liked"+"' OR reason= '"+"unliked"+"') ORDER BY id DESC").then((vis)=>{
        var str;
        vis.forEach((resul)=>{
            var id = Object.values(resul);
            if (str == undefined)
                str = "id = '"+id+"'";
            else
                str = str+" OR id= '"+id+"'";  
        }) 
        if (vis[0] != undefined){
            func.enqp("SELECT * FROM userinfor WHERE "+str+"").then((userr, err) => {
                if (err) throw err;
                res.render('visits', {user:user, vis, userr}); 
            })
        }
        else{
            var vis = [];
            var userr = [];
            res.render('visits', {user:user, vis, userr});
        }
    })
    });
});

//geoloction
router.post('/geolocation', urlencodedParsor, (req, res, next) => {
    var session = req.session;
    ip.address();
    ip.isEqual('::1', '::0:1');
    ip.toBuffer('127.0.0.1');

    const current_url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;
    var lat = search_params.get('lat');
    var lon = search_params.get('lon');

    if (lat != "undefined" && lon != "undefined"){
        func.enq("UPDATE userinfor SET latitude = '"+lat+"', longitude ='"+lon+"' WHERE username='"+session.userid+"'");
        exit;
    }
    else{
        const clientIp = requestIp.getClientIp(req);
        next();
        const geo = geoIp.lookup('192.168.220.1');
    
        if (geo != null){
            var lat = geo.ll[0];
            var lon = geo.ll[1];
            var district = geo.city;
            func.enq("UPDATE userinfor SET latitude = '"+lat+"', longitude ='"+lon+"' WHERE username='"+session.userid+"'");
        }
    }
});

router.post('/tags', urlencodedParsor, (req, res) => {
    var session = req.session;
    const current_url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;
    var uid = search_params.get('uid');
    var tag = search_params.get('tag');

    func.enqp("SELECT * FROM tags WHERE userid ='"+ uid+"'AND tag='" +tag+ "' ").then((resul) => {
        if(resul[0] === undefined)
        {
          func.enq("INSERT INTO tags(userid, tag) VALUES ('"+uid+"','" +tag+ "') ");
        }
    });    
});

//viewprofile

router.get('/viewprofile', (req, res, next) => {
    var session = req.session;
    const current_url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;
    var id = search_params.get('id');
    var user;
    var visited;

    func.enqp("SELECT * FROM notifications WHERE userid= '"+id+"'AND reason= '"+"visited"+"' AND senderid= '"+session.uid+"'").then((vis, next)=>{
        if (vis[0] == undefined)
            func.enq("INSERT INTO notifications(userid, reason, senderid, nread, username) VALUES ('"+id+"','"+"visited"+"','"+session.uid+"','"+0+"','"+session.userid+"')");
        func.enqp("SELECT * FROM notifications WHERE userid= '"+id+"'AND reason= '"+"visited"+"'").then((vis, next)=>{ 
            func.enqp("SELECT * FROM notifications WHERE id="+id+" AND reason='"+"liked"+"'").then((likes, err) =>{
                var score = (likes.length / vis.length) * 10;
                if (err)
                    throw err;
                else
                    func.enq("UPDATE userinfor SET score = '"+score+"' WHERE id='"+id+"'");
            })
        })
    });
    func.enqp("SELECT * FROM connections WHERE (u1 = '"+id+"' AND  u2 = '" +session.uid+ "') OR (u1 = '"+session.uid+"' AND  u2 = '"+id+"')").then((conn) =>{
        if (conn[0] == undefined)
            var status = "not connected: send a like to connect!";
        else{
        if (conn[0]['status'] == 'connected')
            var status = conn[0]["status"];
        else if (conn[0]['status'] == "not connected" && conn[0]['liker'] == session.uid)
            var status = "waiting for the user to like you back before you can chat!";
        else if (conn[0]['status'] == "not connected" && conn[0]['liker'] != session.uid)
            var status = "User waiting for you to like them back before you can chat!";
        else 
            var status = "not connected: send a like to connect!";  
        }
        func.enqp("SELECT * FROM userinfor").then((userr) => {
            if (userr){
                userr.forEach(function(row){
                    if (row["username"] == session.userid)
                        user = row;
                    if (row["id"] == id)
                        visited = row;
                });
                pointA = new GeoPoint(user['latitude'], user['longitude']);
                pointB = new GeoPoint(visited['latitude'], visited['longitude']);
                var dist = (pointA.distanceTo(pointB, true) | 0 ) + 'km';
                var age = getAge(user['date_of_birth']);
                func.SelectQ("SELECT * FROM pics WHERE userid = '" + id +"' ORDER BY id DESC").then((pics, err) => {
                    func.enqp("SELECT * FROM tags WHERE userid = '" + id +"' ORDER BY id DESC").then((tags, err) => {
                        if (err) throw err;
                        if (pics){
                            res.render('viewprofile', {user, visited, status:status, pics, age:age, tags: tags, geo:{dist: dist}});   
                        }
                        else
                            res.render('viewprofile', {user, visited, status:status, pics: undefined, age:age, tags: tags});  
                    });
                });
            }
        });
    });
});

router.get('/makeprofilepic', (req, res) => {
    var session = req.session;
    const current_url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;
    var pic = search_params.get('pic');
    
    func.enq("UPDATE userinfor SET profile_pic = '"+pic+"' WHERE  username = '" +session.userid+ "'");
    res.redirect("myprofile?profilepic=updated");
});

router.get('/deletepic', (req, res) => {
    var session = req.session;
    const current_url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
    const search_params = current_url.searchParams;
    var pic = search_params.get('pic');
    var id = search_params.get('id');
    func.enq("DELETE FROM pics WHERE userid = '"+id+"' AND  name = '" +pic+ "'");
    res.redirect("myprofile?pic=deleted");
});

router.post('/upload', urlencodedParsor, (req, res) => {
    var session = req.session;
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('profile_pic');
    
    upload(req, res, function(err) {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
        func.enqp("SELECT * FROM pics WHERE userid= '"+session.uid+"'").then((count) => {
            if (count.length > 4)
                res.redirect("myprofile?gallery=full");
            else{
                func.enqp("INSERT INTO pics (userid, name) VALUES ('"+ session.uid+"','" +req.file.filename+ "')").then((resul) =>{
                    res.redirect("myprofile?picture=uploaded");
                });
            }
        });
    });
});




router.get('/home', (req, res) => {
    var session = req.session;
    var utags;
    var i;
    var dd = [];
    var o;
    var count = [];
    var num = [];
    var user_row = [];
    
    function name(r, user_row) { 
        var b;
        r.forEach(function(tag){

            pointA = new GeoPoint(user_row['latitude'], user_row['longitude']);
            pointB = new GeoPoint(tag['latitude'], tag['longitude']);
            var dist = (pointA.distanceTo(pointB, true) | 0 );
           // if(dist > 20 || dist == 20)
            //{
                if(b === undefined)
                b = "id = '"+tag["id"]+"'";
            else
                b = b + " OR id = '"+tag["id"]+"'";
            //}
            

       })  
       if (b != undefined)
       {
         func.enqp("SELECT * FROM userinfor WHERE "+b).then((userr, err) => {
            if (err) throw err;
            func.enqp("SELECT * FROM tags WHERE userid = '"+session.uid+"'").then( (resul, err) => {
                if (err) throw err;
                if(resul === undefined)
                {
                    res.render('dashboard', {userr, user_row});
                }
                else{
                    i = 0;
                    resul.forEach(function(tags){
                        dd[i] = tags["tag"];
                        i++;
                        if(utags === undefined)
                            utags = "tag ='"+tags["tags"]+"' ";
                        else
                            utags = utags +" OR tag = '"+tags["tag"]+"' ";   
                    });
                    if(utags) {
                        func.enqp("SELECT * FROM tags WHERE "+utags+" AND NOT id ='"+session.uid+"'").then((rl, err) => {
                            if (err) throw err;
                            i = 0 ;
                            userr.forEach(function(tags){
                                count[i] = tags["id"];
                                num[i] = 0;
                                i++;
                            });
                            for (let i = 0; i < count.length; i++) { 
                                var c = 0;
                                rl.forEach(function(tags){
                                    if (count[i] == tags["userid"])
                                    c++;
                                });
                                num[i] = c;
                            }
                            var a = 0;
                            var z = [];
                            for (let i = 0; i < num.length; i++) {
                               // if(num[i] < 5)
                                //{
                                    if(o === undefined)
                                        o = "id = '"+count[i]+"'";
                                    else
                                        o = o + " OR id = '"+count[i]+"'";
                                        z[a] = count[i];
                                        a++;
                                //}
                            }
                            if (o === undefined)
                            {
                                if (o === undefined)
                                {
                                    userr = [];
                                    res.render('dashboard', {userr, user_row});
                                }
                            }
                            else{
                                func.enqp("SELECT * FROM userinfor WHERE "+ o).then((userr) => {

                                    func.enqp("SELECT * FROM reports").then((reports) => {
                                        var t ;
                                        reports.forEach(r => {

                                            userr.forEach(u => {
                                                if (r["userid"] == u["id"] || r["reporter"] == u["id"] ) {

                                                    if (r["userid"] == session.uid || r["reporter"] == session.uid ) {

                                                        for (let i = 0; i < z.length; i++) {
                                                            if (u["id"] == z[i]) {
                                                                z[i] = 0;
                                                                
                                                            }
                                                            
                                                        }
                                                    }
                                                    
                                                }
                                            });
                                            
                                        });
                                        for (let i = 0; i < z.length; i++) {
                                            if(z[i] > 0)
                                            {
                                                if(t === undefined)
                                                            t = "  id = '"+z[i]+"'";
                                                        else
                                                            t = t + " OR  id = '"+z[i]+"'";
                                            }
                                            
                                        }
                                       
                                        if (t != undefined ) {
                                            func.enqp("SELECT * FROM userinfor WHERE " + t).then((userr, err) => {
                                                if (err) throw err;
                                                res.render('dashboard', {userr, user_row}); 
                                            });   
                                        }else
                                            res.render('dashboard', {userr, user_row});
                                    })
                                })
                            }
                        })  
                    }   
                }
            });
           
            }) 
       }
       else
       {
           userr = [];
        res.render('dashboard', {userr, user_row});
       }
      
                                       
     
        return
    }
    if (session.userid){
        func.enqp("SELECT * FROM userinfor ").then((userr) => {
            if (userr){
                userr.forEach(function(row){
                    if (row["username"] == session.userid){
                        user_row = row;
                        if(row["preference"] == "bisexual" )
                        {
                            if (row["gender"] == "male")
                            {
                                func.enqp("SELECT * FROM userinfor  WHERE  preference = 'male' OR preference = 'bisexual'  AND  NOT username = '"+session.userid+"' ").then((u) => {
                                    name(u,  user_row);    
                                });
                            }
                            else if (row["gender"] == "female")
                            {
                                func.enqp("SELECT * FROM userinfor  WHERE  preference = 'female' OR preference = 'bisexual' AND NOT username = '"+session.userid+"' ").then((u) => {
                                    name(u, user_row);
                                });
                            }
                            else
                            name([],  user_row);
                        }
                        else if(row["preference"] == "male")
                        {
                            if (row["gender"] == "male")
                            {
                                func.enqp("SELECT * FROM userinfor  WHERE NOT username = '"+session.userid+"'  AND preference = 'male' OR preference = 'bisexual' AND gender = 'male'").then((u) => {
                                    name(u,  user_row);
                                });
                            }
                            else if (row["gender"] == "female")
                            {
                                func.enqp("SELECT * FROM userinfor  WHERE NOT username = '"+session.userid+"'  AND preference = 'female' OR preference = 'bisexual' AND gender = 'male'").then((u) => {
                                    name(u,  user_row);
                                });
                            }
                            else
                            name([],  user_row);
                        }
                        else if(row["preference"] == "female")
                        {
                            if (row["gender"] == "female")
                            {
                                func.enqp("SELECT * FROM userinfor  WHERE NOT username = '"+session.userid+"'  AND preference = 'female' OR preference = 'bisexual' AND gender = 'female'").then((u) => {
                                    name(u,  user_row);
                                });
                            }
                            else  if (row["gender"] == "male")
                            {
                                func.enqp("SELECT * FROM userinfor  WHERE NOT username = '"+session.userid+"'  AND preference = 'male' OR preference = 'bisexual' AND gender = 'female'").then((u) => {
                                    name(u,  user_row);
                                });
                            }
                            else
                            name([],  user_row);
                        }
                        else
                        name([],  user_row);
                    }
                });
            }
        });
    }
    else {
        res.end("You are not a user");
    }
});

router.get('/myprofile', (req, res) => {
    var session = req.session;
    if (session.userid === undefined){
        res.end("You are not a user");
    }
    else{ 
        var count;
        func.enqp("SELECT COUNT(*) FROM notifications WHERE userid = '"+session.uid+"'").then((resul) => {
            count = resul;})
        func.SelectQ("SELECT * FROM userinfor WHERE username = '" + session.userid +"'").then((user, err) => {
            if (user){
                var user = user[0];
                if (!user['gender'] || !user['preference'] || !user['bio'] || user['profile_pic'] == 'profile_pic-blankprofile.png'){
                    var profile = 'incomplete';
                    var msg = 'Please complete your profile to get full access to the site!'; 
                }
                else{
                    var profile = 'complete';
                    var msg = '';
                }
                func.SelectQ("SELECT * FROM pics WHERE userid = '" + session.uid +"' ORDER BY id DESC").then((pics, err) => {
                    if (pics){
                        
                        res.render('myprofile', {pics, user: user, msg: msg, profile: profile});   
                    }
                    else
                        res.render('myprofile', {pics: undefined, user: user, msg: '', profile: profile});   
                });     
            }
            else
                throw err;
        });
    }
});

router.get('/people', (req, res) =>{
    var session = req.session;
    func.userMatch().then((resul) => {
        if (resul){
            res.render('people', {resul});
        }
    });
});

///POSTS
router.post('/myprofile', urlencodedParsor, (req, res) => {
    var session = req.session;
  
    if (!session)
        res.send('update session');
    else if (req.body.subbio){
        var bio = req.body.bio;
        func.enq("UPDATE userinfor SET bio = '"+req.body.bio+"' WHERE  username = '" +session.userid+ "'");
        res.redirect('myprofile?bio=updated');
    }
    else if (req.body.subgender){
        var gender = req.body.gender;
        var sexualPref;
        if ((req.body.males && req.body.females) ||(!req.body.males && !req.body.females))
            sexualPref = 'bisexual';
        else if ( req.body.females)
            sexualPref = 'female';
        else
            sexualPref = 'male';
        func.enq("UPDATE userinfor SET gender = '"+gender+"', preference = '"+ sexualPref+"' WHERE  username = '" + session.userid + "'");
        res.redirect('myprofile?preference=updated');
    }

   else if(req.body.subinterests){//INTERESTSsssssssssssssssssssssssssssssssssssssssss
        req.body.interest.forEach(e => {
            func.enqp("SELECT * FROM tags WHERE userid ='"+ session.uid+"'AND tag='" +e+ "' ").then((resul) => {
                if(resul[0] === undefined)
                {
                  func.enq("INSERT INTO tags(userid, tag) VALUES ('"+session.uid+"','" +e+ "') ");
                  res.redirect('myprofile?tags=updated');
                }
            }); 

        });
    }

    else if(req.body.subusername){
        func.SelectQ("SELECT * FROM userinfor WHERE username = '" + req.body.cusername +"'").then((resul, err) => {
            if (err)
                throw err;
            if (resul[0] == undefined){
                func.enq("UPDATE userinfor SET username = '"+ req.body.cusername+"' WHERE email = '" +session.userEmail+ "'");
                session.userid = req.body.cusername;
                res.redirect('myprofile?username=updated');
            }
            else
                res.redirect('myprofile?username=exists');
        });
    }

    else if(req.body.subfirstname){
        func.enq("UPDATE userinfor SET firstname = '"+ req.body.cfirstname+"' WHERE email = '" +session.userEmail+ "'");
        res.redirect('myprofile?firstname=updated');
    }

    else if(req.body.sublastname){
        func.enq("UPDATE userinfor SET lastname = '"+ req.body.clastname+"' WHERE email = '" +session.userEmail+ "'");
        res.redirect('myprofile?lastname=updated');
    }

    else if(req.body.subemail){
        var newemail = req.body.cemail;
        func.SelectQ("SELECT * FROM userinfor WHERE email = '" + newemail +"'").then((resul, err) => {
            if (err)
                throw err;
            if (resul[0] == undefined){
                func.enq("UPDATE userinfor SET email = '"+ newemail+"' WHERE username = '" +session.userid+ "'");
                session.userEmail = newemail;
                res.redirect('myprofile?email=updated');
            }
            else
                res.redirect('myprofile?email=exists');
        });
    }
    
    else if(req.body.subpassword){
        var hasNumber = /\d/;
        var hasSpcialChr = /[`!@#$%^&*()_+\[\]{};':"\\|,.<>\/?~]/;
        if (req.body.cpass == req.body.cpassconf){
            if (req.body.cpass.length >= 5){
                if (hasNumber.test(req.body.cpass) == true || hasSpcialChr.test(req.body.cpass) == true){
                    var password = bcrypt.hashSync(req.body.cpass, 10);
                    func.enq("UPDATE userinfor SET password = '"+ password +"' WHERE username = '" +session.userid+ "'");
                    res.redirect('myprofile?password=updated');
                }
                else    
                    res.redirect('myprofile?password=weak');
            }
            else
                res.redirect('myprofile?password=short');
        }
        else
            res.redirect('myprofile?passwords=different');
    }
});

module.exports = router;