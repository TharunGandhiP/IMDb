const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// Set up MongoDB connection
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// Define schemas and models
const movieSchema = new mongoose.Schema({
  name: String,
  image: String,
  path: String,
});
const Movie = mongoose.model("movies", movieSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model("datas", userSchema);

const reviewSchema = new mongoose.Schema({
  Suggestion: String,
  problem: String,
  movie: String,
  Comments: String,
});
const Review = mongoose.model("reviews", reviewSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "IMDb")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "IMDb"));

// Routes

// Login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "IMDb", "login", "login.html"));
});

// Login functionality
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username }).exec();
    if (!user || (user && user.password !== password)) {
      res.status(401).send("Invalid username or password");
    } else {
      res.cookie("user", user.username);
      res.redirect("/home");
      console.log("logged in");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Signup page
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "IMDb", "signup", "signup.html"));
});

// Signup functionality
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  const user = new User({ username, email, password });
  user
    .save()
    .then((result) => {
      res.redirect("/login");
      console.log("signed up");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

// Logout functionality
app.get("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect("/home");
  console.log("logged out");
});

// Home page
app.get("/home", (req, res) => {
  const username = req.cookies.user;
  if (username) {
    Movie.find({})
      .exec()
      .then((allDetails) => {
        res.render("index", { username: username, details: allDetails });
      })
      .catch((err) => {
        console.error(err);
        res.render("index", { username: username, details: null });
      });
  } else {
    res.render("index", { username: null, details: null });
  }
});

// Submit review page
app.get("/submit", (req, res) => {
  res.render("form");
});

// Submit review functionality
app.post("/submit", async (req, res) => {
  const info = {
    Suggestion: req.body.Suggestion,
    problem: req.body.problem,
    movie: req.body.movie,
    Comments: req.body.Comments,
  };

  const review = new Review(info);
  try {
    await review.save();
    console.log("Review submitted");
    res.redirect("/home");
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send("Error occurred");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
