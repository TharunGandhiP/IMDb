const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const bodyParser = require("body-parser");
const path = require('path');

// Define the directory to serve static files from
app.use(express.static("signup"));
app.use(express.static(path.join(__dirname, "IMDb", "SignUp")));

// Connection URL and MongoDB connection
var url = "mongodb://127.0.0.1:27017/logins";
mongoose.connect(url, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));

// Schema creation
var mySchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

// Get the data through the form
var data = mongoose.model("datas", mySchema);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "IMDb", "SignUp", "signup.html"));
});

app.post("/", (req, res) => {
  var info = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  };

  // Saving the form data in collection
  var me = new data(info);
  me.save()
    .then((savedDoc) => {
      console.log("Signed Up");
      res.redirect('/home');
    })
    .catch((err) => {
      console.log("error occurred:", err);
      res.status(500).send("Error occurred while saving data");
    });
});

// Home page route
app.get('/home', (req, res) => {
  res.redirect('http://localhost:3000');
});

app.listen(5000, () => console.log("SignUp listening on 5000"));
