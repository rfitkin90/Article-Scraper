var express = require('express');
var path = require('path');
var router = express.Router();

// main page
router.get("/", function (req, res) {
   res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = router;