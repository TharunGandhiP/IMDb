var express = require("express"),
app = express(),
bodyparser = require("body-parser"),
mongoose = require("mongoose");
const path = require('path');
// connecting mongodb
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/imdbdb", {useNewUrlParser:
true});
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'IMDb'));
app.use(express.static(path.join(__dirname, 'IMDb')));
var mySchema = new mongoose.Schema({
name :String,
image :String,
path :String
});
var movies=mongoose.model("movies", mySchema);
// app.get("/", function (req, res) {
// res.render("index",{ details: null })
// })
app.get("/home", function (req, res) {
movies.find({}).exec()
  .then(allDetails => {
    res.render("index", { details: allDetails })
  })
  .catch(err => {
    console.log(err);
    res.render("index", { details: null })
  });
})

//app.use(express.static(__dirname));

app.listen(8000, "localhost", function () {
    console.log("server has started"); 
});