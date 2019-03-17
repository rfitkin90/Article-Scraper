// var db = require("../models");
var express = require("express");
var cheerio = require('cheerio');
var axios = require('axios');
var router = express.Router();
var db = require("../models");

// scrape current affairs articles
router.get("/scrape", function (req, res) {

   // var results = [];

   axios.get("https://www.currentaffairs.org/posts?page=1").then(function (response) {
      var $ = cheerio.load(response.data);
      console.log('scrape route hit');

      return $("div#content").children('div.row').each(function (i, elem) {
         // results.push({
         //    img: $(elem).find('img').attr('src'),
         //    headline: $(elem).find('h2.post-title').children('a').text(),
         //    URL: 'https://www.currentaffairs.org' +
         //       $(elem).find('h2.post-title').children('a').attr('href'),
         //    summary: $(elem).children('div.col-md-8').children('p:nth-child(3)').text(),
         //    byLine: `by ${$(elem).find('span.post-author').children('a').text()}`,
         //    byLineURL: 'https://www.currentaffairs.org' +
         //       $(elem).find('span.post-author').children('a').attr('href')
         // });

         db.Article.create({
            img: $(elem).find('img').attr('src'),
            headline: $(elem).find('h2.post-title').children('a').text(),
            URL: 'https://www.currentaffairs.org' +
               $(elem).find('h2.post-title').children('a').attr('href'),
            summary: $(elem).children('div.col-md-8').children('p:nth-child(3)').text(),
            byLine: `by ${$(elem).find('span.post-author').children('a').text()}`,
            byLineURL: 'https://www.currentaffairs.org' +
               $(elem).find('span.post-author').children('a').attr('href')
         })
            .then(function (data) {
               console.log(data);
            })
            .catch(function (err) {
               console.log(err);
            });
         ;
      });

   }).then(function () {
      axios.get("https://www.currentaffairs.org/posts?page=2").then(function (response) {
         var $ = cheerio.load(response.data);
         console.log('scrape route hit');

         $("div#content").children('div.row').each(function (i, elem) {
            // results.push({
            //    img: $(elem).find('img').attr('src'),
            //    headline: $(elem).find('h2.post-title').children('a').text(),
            //    URL: 'https://www.currentaffairs.org' +
            //       $(elem).find('h2.post-title').children('a').attr('href'),
            //    summary: $(elem).children('div.col-md-8').children('p:nth-child(3)').text(),
            //    byLine: `by ${$(elem).find('span.post-author').children('a').text()}`,
            //    byLineURL: 'https://www.currentaffairs.org' +
            //       $(elem).find('span.post-author').children('a').attr('href')
            // });

            db.Article.create({
               img: $(elem).find('img').attr('src'),
               headline: $(elem).find('h2.post-title').children('a').text(),
               URL: 'https://www.currentaffairs.org' +
                  $(elem).find('h2.post-title').children('a').attr('href'),
               summary: $(elem).children('div.col-md-8').children('p:nth-child(3)').text(),
               byLine: `by ${$(elem).find('span.post-author').children('a').text()}`,
               byLineURL: 'https://www.currentaffairs.org' +
                  $(elem).find('span.post-author').children('a').attr('href')
            })
               .then(function (data) {
                  console.log(data);
               })
               .catch(function (err) {
                  console.log(err);
               });
            ;
         });

         // res.json(results);
         // return console.log(results);
         res.send('Scraping complete!');
      });
   });

});

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

// Route for grabbing a specific Article by id, populate it with its note
router.get("/articles/:id", function (req, res) {
   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
   db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function (data) {
         // If we were able to successfully find an Article with the given id, send it back to the client
         res.json(data);
      })
      .catch(function (err) {
         // If an error occurred, send it to the client
         res.json(err);
      });
   ;
});

// Route for saving/updating an Article's associated Note
router.post("/articles/:id", function (req, res) {
   // Create a new note and pass the req.body to the entry
   db.Note.create(req.body)
      .then(function (dbNote) {
         // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
         // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
         // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
         return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function (dbArticle) {
         // If we were able to successfully update an Article, send it back to the client
         res.json(dbArticle);
      })
      .catch(function (err) {
         // If an error occurred, send it to the client
         res.json(err);
      });
});

module.exports = router;