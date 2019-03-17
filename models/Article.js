var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
   img: {
      type: String,
      required: true
   },
   headline: {
      type: String,
      required: true
   },
   URL: {
      type: String,
      required: true
   },
   summary: {
      type: String,
      required: true
   },
   byLine: {
      type: String,
      required: true
   },
   byLineURL: {
      type: String,
      required: true
   },
   comments: [
      {
         type: Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;