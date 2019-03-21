var express = require('express');
var path = require('path');
var router = express.Router();
var db = require("../models");

// main page
router.get("/", function (req, res) {
   // for handlebars, do a mongodb method here instead of in an API route
   db.Article.find({})
      .then(function (data) {
         // res.json(data);
         console.log('\n\n |========================================================================|\n',
            '|==============================Article Data==============================|\n',
            '|========================================================================|\n\n', data);
         // then do a .render and pass the database data along with the index file instead of a .sendFile
         res.render('index', { articles: data });
      })
      .catch(function (err) {
         res.json(err);
      });
   ;

});

module.exports = router;