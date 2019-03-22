var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
var apiRoutes = require("./routes/apiRoutes.js");
var authRoutes = require("./routes/authRoutes.js");
var htmlRoutes = require("./routes/htmlRoutes");
var exphbs = require("express-handlebars");
var path = require('path');
var app = express();

const bodyParser = require('body-parser');
const passport = require('passport');
const UserModel = require('./models/User');

mongoose.connect('mongodb://127.0.0.1:27017/passport-jwt');
mongoose.connection.on('error', error => console.log(error));
mongoose.Promise = global.Promise;

require('./auth/auth');

app.use(bodyParser.urlencoded({ extended: false }));

const routes = require('./routes/authRoutes');
const secureRoute = require('./routes/secure-routes');

app.use('/', routes);
//We plugin our jwt strategy as a middleware so only verified users can access this route
app.use('/user', passport.authenticate('jwt', { session: false }), secureRoute);

//Handle errors
app.use(function (err, req, res, next) {
   res.status(err.status || 500);
   res.json({ error: err });
});

var PORT = process.env.PORT || 3000;


app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.use("/api", apiRoutes);
app.use("/auth", authRoutes);

// Set Handlebars.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(htmlRoutes);


app.listen(PORT, function () {
   console.log(`App running on port ${PORT}`);
});

