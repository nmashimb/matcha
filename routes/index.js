const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParsor = bodyParser.urlencoded({extended: false });

router.get('/', (req, res) => res.render('welcome'));

module.exports = router;
