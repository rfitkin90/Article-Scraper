var express = require('express');
var path = require('path');
var router = express.Router();
var db = require("../models");

// main page
router.get("/", function (req, res) {
   db.Article.find({})
      .then(function (data) {
         // res.json(data);
         console.log('data:', data);
         res.render('index', { data: data });
      })
      .catch(function (err) {
         res.json(err);
      });
   ;

});

module.exports = router;