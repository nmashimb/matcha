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
app.use('/admin', require('./routes/users'));
app.use(express.static('app/public'));




app.get('/test', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

  var cors = require("cors");
var testAPIRouter = require('./routes/testAPI');

  app.use(cors());
  app.use("/testAPI", testAPIRouter);

//listen to port
app.listen(5000);
console.log('you are listening to port 5000');
