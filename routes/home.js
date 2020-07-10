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
    var name = search_params.get('username');
    
   func.enq("INSERT INTO `chats`( `connectionid`,`message`, `senderid`, `recusername`) VALUES ('"+id+"','"+message+"','"+session.uid+"', '"+name+"')");
return

});

// fetch messages

router.get('/messages', urlencodedParsor, (req, res, next) => {
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
    
        con.query("SELECT * FROM chats WHERE connectionid ='"+id+"'", function (err, result) {
            if (err) throw err;
            var i = "";
            result.forEach(e => {
                i = i + "<h1>"+e['senderid']+"</h1><p>"+e['message']+"</p>"
            });
            res.writeHead(200)
            res.write(i);
            res.end();
        });
return

});

//chats

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
                                            v = v + "<br> <a href='/loggedin/viewchat?id="+ss[j]["id"]+"'><img src='/"+dd[i]['profile_pic']+"' style='border-radius: 50%;width:30px;height:30px'></a><h3>"+ dd[i]["username"] +"<h5 style='color: blue';>online</h5></h3></p>";
                                    }
                                }
                                else
                                {
                                    if (ss[j]["u1"] == dd[i]["id"]) {
                                        v = v + "<br> <a href='/loggedin/viewchat?recusername="+ss[j]['username']+"&id="+ss[j]["id"]+"'><img src='/"+dd[i]['profile_pic']+"' style='border-radius: 50%;width:30px;height:30px'></a><h3>"+ dd[i]["username"] +"<h5 style='color: blue';>online</h5></h3></p>";
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

    func.enqp("SELECT * FROM notifications WHERE userid = '"+session.uid+"'").then( (ss, err) =>{
        var i = "";
        ss.forEach(e => {
            i = i + "<div>"+e["username"]+"   "+e["reason"]+" your profile</div>"
        });
       res.writeHead(200)
       res.write(i);
       res.end();
     
    })
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
                  //  dd[i] = tags["tag"];
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
                            for (let i = 0; i < num.length; i++) {
                                if(num[i] >= tags)
                                {
                                    if(o === undefined)
                                        o = "id = '"+count[i]+"'";
                                    else
                                        o = o + " OR id = '"+count[i]+"'";
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
                                if (sort == "age" || sort == "popularity" ){
                                    if (sort == "popularity")
                                        o = o + " ORDER BY score DESC";
                                    else
                                        o = o + " ORDER BY "+sort+" DESC";
                                }
                                   
                                func.enqp("SELECT * FROM userinfor WHERE "+o).then((s) => {
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
                                        console.log(s);

                                        res.writeHead(200)
                                        res.write(JSON.stringify(ss));
                                        res.end();
                                        console.log( ss.length);console.log( s.length);
                                        console.log( count);console.log( num);


                                    }
                                    else
                                    {
                                        res.writeHead(200)
                                        res.write(JSON.stringify(s));
                                        res.end();
                                        console.log();
                                    }
                                
                                })
                            }
                            
                        })  
                    } 
                
            }
        })
    }
    age = age.split('-');
    if (gender == "all") {
        func.enqp("SELECT * FROM userinfor WHERE  age >= '"+age[0]+"' AND age <= '"+age[1]+"' AND score >='"+popularity+"' AND NOT id  = '"+session.uid+"'").then((r)=>{
            name(r,tags,sort,popularity,location);
        })
    }
    else{

        func.enqp("SELECT * FROM userinfor WHERE gender = '"+gender+"' AND age >= '"+age[0]+"' AND age <= '"+age[1]+"' AND score >='"+popularity+"' AND NOT id  = '"+session.uid+"'").then((r)=>{
            name(r,tags,sort,popularity,location);
        })
    }
    return   
});


router.get('/visits', (req, res) => {
    var session = req.session;
    func.enqp("SELECT * FROM userinfor WHERE id = '"+session.uid+"'").then((user, err) => {
    if (err) throw err;
    func.SelectQ("SELECT senderid FROM notifications WHERE userid= '"+session.uid+"'AND (reason= '"+"visited"+"' OR reason= '"+"liked"+"' OR reason= '"+"unliked"+"') ORDER BY id DESC").then((vis)=>{
        console.log(vis);
        var str;
        vis.forEach((resul)=>{
            var id = Object.values(resul);
            if (str == undefined)
                str = "id = '"+id+"'";
            else
                str = str+" OR id= '"+id+"'";  
        }) 
        func.enqp("SELECT * FROM userinfor WHERE "+str+"").then((userr, err) => {
            if (err) throw err;
            res.render('visits', {user:user, vis, userr}); 
        })
    })
    });
});

//geoloction
router.post('/geolocation', urlencodedParsor, (req, res, next) => {
    var session = req.session;
    ip.address();
    ip.isEqual('::1', '::0:1');
    ip.toBuffer('127.0.0.1');
    ip.toString(new Buffer.from([127, 0, 0, 1]));
    ip.fromPrefixLen(24);
    ip.mask('192.168.1.134', '255.255.255.0');
    ip.cidr('192.168.1.134/26');
    ip.not('255.255.255.0');
    ip.or('192.168.1.134', '0.0.0.255');
    ip.isPrivate('127.0.0.1');
    ip.isV6Format('::ffff:127.0.0.1');

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
  

        console.log(clientIp);
        const geo = geoIp.lookup(clientIp);
        console.log('geo '+geo);
    
        if (geo != null){
            var lat = geo.ll[0];
            var lon = geo.ll[1];
            console.log('lattt '+geo.ll[0]);
            var district = geo.city;
            func.enq("UPDATE userinfor SET latitude = '"+lat+"', longitude ='"+lon+"' WHERE username='"+session.userid+"'");
            //console.log('CLIENTIP '+clientIp+' GEO '+geo.ll+'  '+lon);
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
                var age = getAge(user['date_of_birth']);
                func.SelectQ("SELECT * FROM pics WHERE userid = '" + id +"' ORDER BY id DESC").then((pics, err) => {
                    func.enqp("SELECT * FROM tags WHERE userid = '" + id +"' ORDER BY id DESC").then((tags, err) => {
                        if (err) throw err;
                        if (pics){
                            res.render('viewprofile', {user, visited, status:status, pics, age:age, tags: tags});   
                        }
                        else
                            res.render('viewprofile', {user, visited, status:status, pics: undefined, age:age, tags: tags});  
                    });
                });
            
                //pointFrom = new GeoPoint(-26.2052125, 28.0397575);
                //pointDes = new GeoPoint(visited['latitude'], visited['longitude']);
               // var dis = pointFrom.distanceTo(pointDes, true);
               // console.log(dis);
               // res.render('viewprofile', {user, visited, status:status});
            }
        });
    });
   /* func.enqp("SELECT * FROM userinfor").then((userr) => {
        if (userr){
            userr.forEach(function(row){
                if (row["username"] == session.userid)
                    user = row;
                if (row["id"] == id)
                    visited = row;
            });
        
            pointFrom = new GeoPoint(-26.2052125, 28.0397575);
            //pointDes = new GeoPoint(visited['latitude'], visited['longitude']);
           // var dis = pointFrom.distanceTo(pointDes, true);
           // console.log(dis);
            res.render('viewprofile', {user, visited});
        }
    });*/
    //res.render('viewprofile');
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

    function name(userr, user_row) {                                    
        func.enqp("SELECT * FROM tags WHERE userid = '"+session.uid+"'").then((resul) => {
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
                    func.enqp("SELECT * FROM tags WHERE "+utags+" AND NOT id ='"+session.uid+"'").then((rl) => {

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
                        for (let i = 0; i < num.length; i++) {
                            if(num[i] > 5)
                            {
                                if(o === undefined)
                                    o = "id = '"+count[i]+"'";
                                else
                                    o = o + " OR id = '"+count[i]+"'";
                            }
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
                            func.enqp("SELECT * FROM userinfor WHERE "+o).then((userr) => {
                            res.render('dashboard', {userr, user_row});
                            })
                        }
                    })  
                }   
            }
        });
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
                                func.enqp("SELECT * FROM userinfor  WHERE  preference = 'male' OR preference = 'bisexual'  AND  NOT username = '"+session.userid+"' ").then((userr) => {
                                    name(userr,  user_row);    
                                });
                            }
                            else 
                            {
                                func.enqp("SELECT * FROM userinfor  WHERE  preference = 'female' OR preference = 'bisexual' AND NOT username = '"+session.userid+"' ").then((userr) => {
                                    name(userr, user_row);
                                });
                            }
                        }
                        else if(row["preference"] == "male")
                        {
                            if (row["gender"] == "male")
                            {
                                func.enqp("SELECT * FROM userinfor  WHERE NOT username = '"+session.userid+"' AND gender = 'male' AND preference = 'male' OR preference = 'bisexual' ").then((userr) => {
                                    name(userr,  user_row);
                                });
                            }
                            else 
                            {
                                func.enqp("SELECT * FROM userinfor  WHERE NOT username = '"+session.userid+"' AND gender = 'male' AND preference = 'female' OR preference = 'bisexual' ").then((userr) => {
                                    name(userr,  user_row);
                                });
                            }
                        }
                        else
                        {
                            if (row["gender"] == "female")
                            {
                                func.enqp("SELECT * FROM userinfor  WHERE NOT username = '"+session.userid+"' AND gender = 'female' AND preference = 'female' OR preference = 'bisexual' ").then((userr) => {
                                    name(userr,  user_row);
                                });
                            }
                            else 
                            {
                                func.enqp("SELECT * FROM userinfor  WHERE NOT username = '"+session.userid+"' AND gender = 'female' AND preference = 'male' OR preference = 'bisexual' ").then((userr) => {
                                    name(userr,  user_row);
                                });
                            }
                        }
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
                        console.log(pics);
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
        var interests = req.body.interest;
        console.log(interests);
        MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
            var dbo = db.db('matcha');
            dbo.collection("users").updateOne({username: 'nik'}, {$set: {'interests':interests}}); 
        });
        res.redirect('myprofile?');
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