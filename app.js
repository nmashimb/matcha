const express = require('express');
const db = require('./config/server');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const flash = require('connect-flash'); //The flash is typically used in combination with redirects, ensuring that the message is available to the next page that is to be rendered.
const session = require('express-session');
require('./config/server'); //sets up database
var user = require('./config/functions');

app.use(expressLayouts);
//set template engine EJS
app.set('view engine', 'ejs');
//var todoController = require('./controllers/todoController');
//BodyParser
//var bodyParser = require('body-parser');
//var urlencodedParsor= bodyParser.urlencoded({extended: false });
//Express session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
//Connect flash
app.use(flash());
//static files
app.use(express.static('./public'));
//fire controller
//todoController(app);

//Routes
app.use('/', require('./routes/index'));
app.use('/loggedin', require('./routes/home'));
app.use('/users', require('./routes/users'));

//listen to port
app.listen(3000);
console.log('you are listening to port 3000');

