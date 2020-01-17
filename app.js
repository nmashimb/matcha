const express = require('express');
const expressLayouts = require('express-ejs-layouts');
//var todoController = require('./controllers/todoController');
//var bodyParser = require('body-parser');
const app = express();
require('./data/server'); //sets up database
//var urlencodedParsor= bodyParser.urlencoded({extended: false });
//set template engine EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
//static files
//app.use(express.static('./public'));
//fire controller
//todoController(app);

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


//listen to port
app.listen(3000);
console.log('you are listening to port 3000');

