var express = require("express");
var cheerio = require('cheerio');
var axios = require('axios');
var router = express.Router();
var db = require("../models");

// scrape current affairs articles
router.get("/scrape", function (req, res) {

   // create array for scraped objects
   var results = [];

   // scrape from page 1
   axios.get("https://www.currentaffairs.org/posts?page=1").then(function (response) {
      // var $ = cheerio.load(response.data);
      // return $("div#content").children('div.row').each(function (i, elem) {
      //    // push scraped objects into array
      //    pushResults($, elem);
      // });
   }).then(function () {
      // then scrape from page 2
      axios.get("https://www.currentaffairs.org/posts?page=2").then(function (response) {
         var $ = cheerio.load(response.data);
         $("div#content").children('div.row').each(function (i, elem) {
            // push scraped objects into array
            pushResults($, elem);
         });
         // reverse array
         results.reverse();
         // insert each element of array into database
         /* (this is the only way I could think of to get new articles posted
            after the initial scrape into the database in sequential order) */
         results.forEach(elem => {
            db.Article.insertMany(elem)
               .then(function (data) {
                  console.log('elem:', elem)
                  console.log('data:', data);
               })
               .catch(function (err) {
                  console.log(err);
               });
            ;
         });
         res.send('Scraping complete!');
      });
   });

   var pushResults = ($, elem) => {
      return results.push({
         img: $(elem).find('img').attr('src'),
         headline: $(elem).find('h2.post-title').children('a').text(),
         URL: 'https://www.currentaffairs.org' +
            $(elem).find('h2.post-title').children('a').attr('href'),
         summary: $(elem).children('div.col-md-8').children('p:nth-child(3)').text(),
         byLine: `by ${$(elem).find('span.post-author').children('a').text()}`,
         byLineURL: 'https://www.currentaffairs.org' +
            $(elem).find('span.post-author').children('a').attr('href')
      });
   }

});

// get all the articles
router.get("/articles", function (req, res) {

   db.Article.find({})
      .then(function (data) {
         res.json(data);
      })
      .catch(function (err) {
         res.json(err);
      });
   ;

});

// get a specific article and its comments
router.get("/articles/:id", function (req, res) {

   db.Article.findOne({ _id: req.params.id })
      .populate("comments")
      .then(function (data) {
         res.json(data);
      })
      .catch(function (err) {
         res.json(err);
      });
   ;

});

// post a comment to an article
router.post("/articles/:id", function (req, res) {
   console.log('req.body:', req.body);

   db.Comment.create(req.body)
      .then(function (data) {
         console.log('data id:', data._id);
         return db.Article.update(
            {
               _id: req.params.id
            },
            {
               $push: { comments: data._id }
            });
         ;
      })
      .then(function (data) {
         res.json(data);
      })
      .catch(function (err) {
         res.json(err);
      });
   ;

});

// delete a comment from an article
router.delete('/comments/:id', function (req, res) {

   db.Comment.remove({
      _id: req.params.id
   })
      .then(function (data) {
         res.json(data);
      })
      .catch(function (err) {
         res.json(err);
      });
   ;

});

module.exports = router;