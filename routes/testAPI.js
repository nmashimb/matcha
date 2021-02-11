const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');

router.get("/", function(req, res, next) {
    res.send("API iS WORKING PROPERLY");
})

module.exports = router;