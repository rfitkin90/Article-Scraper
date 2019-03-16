// var db = require("../models");
var express = require("express");
var cheerio = require('cheerio');
var axios = require('axios');
var router = express.Router();

router.get("/scrape", function (req, res) {
   axios.get("https://www.currentaffairs.org/posts?page=1").then(function (response) {
      var $ = cheerio.load(response.data);
      console.log('scrape route hit');

      var results = [];
      $("div#content").children('div.row').each(function (elem) {
         console.log('img', $(elem).find('img').attr('src'));
         results.push({
            img: $(elem).find('img').attr('src'),
            headline: $(elem).find('h2.post-title').children('a').text(),
            URL: `https://www.currentaffairs.org${$(elem).find('h2.post-title').children('a').attr('href')}`,
            summary: $(elem).children('div.col-md-8').children('p:nth-child(2)'),
            byLine: `by ${$(elem).find('span.post-author').children('a').text()}`,
            byLineURL: `https://www.currentaffairs.org${$(elem).find('span.post-author').children('a').attr('href')}`
         });
      });

      console.log(results);
      res.json(results);
   });
});

module.exports = router;