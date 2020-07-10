const express = require('express');
const db = require('./config/server');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const flash = require('connect-flash'); //The flash is typically used in combination with redirects, ensuring that the message is available to the next page that is to be rendered.
const session = require('express-session');
var user = require('./config/functions');
var mysql = require('mysql');

app.set('view engine','ejs');
app.set('view ','app/views');


app.use(expressLayouts);
//set template engine EJS
app.set('view engine', 'ejs');

//Express session middleware
/*app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));*/
app.use(session({
    key: 'user_id',
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: 600000000
    }
}));
//Connect flash
app.use(flash());

app.use(express.static('./public'));
app.use(express.static('./public/images'));
app.use(express.static('./public/scripts'));


//Routes
app.use('/loggedin/viewprofile', require('./routes/viewprofile'));
app.use('/loggedin', require('./routes/home'));
app.use('/', require('./routes/index'));
app.use('/loggedin/search', require('./routes/search'));
app.use('/loggedin/chat', require('./routes/chat'));
app.use('/loggedin/viewchat', require('./routes/viewchat'));
app.use('/loggedin/notifications', require('./routes/notifications'));
app.use('/users', require('./routes/users'));
app.use('/people', require('./routes/home'));
app.use(express.static('app/public'));


app.get('/test', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  /*
app.get('/fun', (req, res) => {
    res.render('testt');//res.sendFile(__dirname+'/test.html');
});*/
//  console.log(io.on('connection', (socket) => { console.log('user connected')}));
  

/*io.on('connection', (socket) => {
      socket.emit('chat-message', 'Hello World')
    console.log('a user connected');
  });*/





//listen to port
app.listen(5000);
console.log('you are listening to port 5000');







/*var http  = require('http').createServer(app);
var io      = require('socket.io').listen(http);

http.listen(3001, function(){
    console.log('http listening on port 3001');
});

io.on('connection', function(socket){
    console.log(' A user connected');
    setTimeout(function(){
        socket.send("sent message")
    }, 4000); 
    socket.on('disconnect', function(){
        console.log('a user is disconnected');
    })
});


app.get('/chatting', (req, res) =>{
    //res.render('chat');
    res.send('<h1>RqqR</h1><script>"/socket.io/socket.io.js"</script><script>console.log("ss");var socket = io(); </script>');
});*/