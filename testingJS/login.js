const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Set up a MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/logins', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Database connection successful');
})
.catch((err) => {
  console.error('Database connection error:', err);
});

// Define a user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
});
const User = mongoose.model('datas', userSchema);

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'IMDb')));

// Login page route
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'IMDb', 'login', 'login.html'));
});

//login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username }).exec();
    if (!user || (user && user.password !== password)) {
      res.status(401).send('Invalid username or password');
    } else {
      // Save user session here
      res.redirect('/home');
      console.log('logged in');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});





// Home page route
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'IMDb', 'index.html'));
  });
  

// Start the server
app.listen(8000, () => {
  console.log('Server started on port 8000');
});
