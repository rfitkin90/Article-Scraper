var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
var apiRoutes = require("./routes/apiRoutes.js");
var htmlRoutes = require("./routes/htmlRoutes");
var path = require('path');

var PORT = process.env.PORT || 3000;

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

app.use("/api", apiRoutes);

app.use(htmlRoutes);


app.listen(PORT, function () {
   console.log(`App running on port ${PORT}`);
});