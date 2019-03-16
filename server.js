var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
// var axios = require('axios');
// var cheerio = require('cheerio');
var apiRoutes = require("./routes/apiRoutes.js");
// var db = require('./models');

var PORT = process.env.port || 3000;

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

app.use("/api", apiRoutes);

app.listen(PORT, function () {
   console.log("App running on port " + PORT + "!");
});