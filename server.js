const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();

// Set up a MongoDB connection
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/imdbdb", {
useNewUrlParser: true,
useUnifiedTopology: true,
})
.then(() => {
console.log("Database connection successful");
})
.catch((err) => {
console.error("Database connection error:", err);
});

// Define a movie schema
const movieSchema = new mongoose.Schema({
name: String,
image: String,
path: String
});
const Movie = mongoose.model("movies", movieSchema);

// Define a user schema
const userSchema = new mongoose.Schema({
username: { type: String, required: true },
email   : { type: String, required: true },
password: { type: String, required: true }
});
const User = mongoose.model("datas", userSchema);

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "IMDb"));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "IMDb")));

// Login page route
app.get("/login", (req, res) => {
res.sendFile(path.join(__dirname, "IMDb", "login", "login.html"));
});

// Login route
app.post("/login", async (req, res) => {
const { username, password } = req.body;
try {
const user = await User.findOne({ username: username }).exec();
if (!user || (user && user.password !== password)) {
res.status(401).send("Invalid username or password");
} else {
// Save user session here
res.cookie("user", user.username);
res.redirect("/home");
console.log("logged in");
}
} catch (err) {
console.error(err);
res.status(500).send("Internal Server Error");
}
});

// Signup page route
app.get("/signup", (req, res) => {
res.sendFile(path.join(__dirname, "IMDb", "SignUp", "signup.html"));
});

// Signup route
app.post("/signup", (req, res) => {
const { username, email, password } = req.body;
const user = new User({ username, email, password });
user.save()
.then(result => {
// Save user session here
res.redirect("/login");
console.log("signed up");
})
.catch(err => {
console.error(err);
res.status(500).send("Internal Server Error");
});
});

// Logout route
app.get("/logout", (req, res) => {
res.clearCookie("user");
res.redirect("/home");
console.log("logged out");
});

// Home page route
app.get("/home", (req, res) => {
const username = req.cookies.user;
if (username) {
Movie.find({}).exec()
.then(allDetails => {
res.render("index", { username: username, details: allDetails });
})
.catch(err => {
console.error(err);
res.render("index", { username: username, details: null });
});
} else {
res.render("index", { username: null, details: null });
}
});

// Define a review schema
const reviewSchema = new mongoose.Schema({
    Suggestion: String,
    problem: String,
    movie: String,
    Comments: String
    });
    const Review = mongoose.model('reviews', reviewSchema);

// Submit review page route
app.get('/submit', (req, res) => {
    res.render('form');
    });
    
// Submit review route
    app.post('/submit', async (req, res) => {
    const info = {
    Suggestion: req.body.Suggestion,
    problem: req.body.problem,
    movie: req.body.movie,
    Comments: req.body.Comments
    };
    
    const review = new Review(info);
    try {
    await review.save();
    console.log("done");
    res.redirect('/home');
    } catch (error) {
    console.log("error occurred");
    res.status(500).send("Error occurred");
    }
    });
    
// Start the server
    app.listen(3000, () => {
    console.log('Server started on port 3000');
    });