const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require('path');


app.use(express.static(path.join(__dirname, 'IMDb')));
app.set('views', path.join(__dirname, 'IMDb', 'form'));
var Schema = mongoose.Schema;

// defining schema
const mySchema = new mongoose.Schema({
  Suggestion: String,
  problem: String,
  movie: String,
  Comments: String
});

// connection url and mongodb connection
const url = "mongodb://127.0.0.1:27017/review";
mongoose.connect(url, { useNewUrlParser: true });

// create a model
const review = mongoose.model("review", mySchema);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/form', (req, res) => {
  res.render('form');
});

app.post('/submit', async (req, res) => {
  const info = {
    Suggestion: req.body.Suggestion,
    problem: req.body.problem,
    movie: req.body.movie,
    Comments: req.body.Comments
  };

  const me = new review(info);
  try {
    await me.save();
    console.log("done");
    res.send("Done!");
  } catch (error) {
    console.log("error occurred");
    res.send("Error occurred");
  }
});

app.listen(8000, () => console.log("listening on 8000"));