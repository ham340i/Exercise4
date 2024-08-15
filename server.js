const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const app = express();
const PORT = 3000;

// Define paths for the files
const loginFilePath = path.join(__dirname, 'login.txt');
const petsFilePath = path.join(__dirname, 'pets.txt');

let users = [];
fs.readFile(loginFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading login.txt:', err);
        return;
    }
    users = data.trim().split('\n').map(line => line.split(':'));
});

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to handle sessions
app.use(session({
  secret: 'your-secret-key', // Replace with a strong secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Middleware to check if user is logged in
const sessionMiddleware = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Helper function to read file contents
const readFile = (filePath) => {
  return fs.readFileSync(filePath, 'utf8').trim();
};

// Helper function to write to a file
const writeFile = (filePath, data) => {
  fs.writeFileSync(filePath, data, 'utf8');
};

// Route to serve the home page
app.get('/', (req, res) => {
  const header = readFile(path.join(__dirname, 'views', 'header.html'));
  const footer = readFile(path.join(__dirname, 'views', 'footer.html'));
  const home = readFile(path.join(__dirname, 'views', 'Home.html'));
  res.send(header + home + footer);
});

// Route to serve the login page
app.get('/login', (req, res) => {
  const header = readFile(path.join(__dirname, 'views', 'header.html'));
  const footer = readFile(path.join(__dirname, 'views', 'footer.html'));
  const loginPage = readFile(path.join(__dirname, 'views', 'login.html'));
  res.send(loginPage + footer);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log('Received username:', username);
  console.log('Received password:', password);

  const user = users.find(u => u[0]?.trim() === username?.trim() && u[1]?.trim() === password?.trim());

  if (user) {
      res.send('Login successful');
  } else {
      res.send('Invalid username or password');
  }
});

// Pet registration route
app.post('/register-pet', sessionMiddleware, (req, res) => {
  const { name, species, breed, age, description } = req.body;
  const username = req.session.user;

  const fileContent = readFile(petsFilePath);
  const nextId = fileContent.split('\n').length + 1;
  const newPetEntry = `${nextId}:${username}:${species}:${breed}:${age}:${description}\n`;
  writeFile(petsFilePath, fileContent + newPetEntry);

  res.send('Pet registered successfully');
});

// Route to serve the create account page
app.get('/create-account', (req, res) => {
  const header = readFile(path.join(__dirname, 'views', 'header.html'));
  const footer = readFile(path.join(__dirname, 'views', 'footer.html'));
  const createAccountPage = readFile(path.join(__dirname, 'views', 'create_account.html'));
  res.send(header + createAccountPage + footer);
});

// Register new user route
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  const usernameRegex = /^[a-zA-Z0-9]+$/;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/;

  if (!usernameRegex.test(username) || !passwordRegex.test(password)) {
    res.status(400).send('Invalid username or password format');
    return;
  }

  const fileContent = readFile(loginFilePath);
  const existingUsers = fileContent.split('\n').map(line => line.split(':'));
  if (existingUsers.some(([user]) => user === username)) {
    res.status(400).send('Username already exists. Please choose a different username.');
    return;
  }

  const newUserLine = `${username}:${password}\n`;
  writeFile(loginFilePath, fileContent + newUserLine);

  res.send('Account created successfully. You can now log in.');
});

// Route to serve the dog care page
app.get('/dog-care', (req, res) => {
  const header = readFile(path.join(__dirname, 'views', 'header.html'));
  const footer = readFile(path.join(__dirname, 'views', 'footer.html'));
  const dogCare = readFile(path.join(__dirname, 'views', 'Dog_Care.html'));
  res.send(header + dogCare + footer);
});

// Route to serve the privacy page
app.get('/privacy', (req, res) => {
  const header = readFile(path.join(__dirname, 'views', 'header.html'));
  const footer = readFile(path.join(__dirname, 'views', 'footer.html'));
  const privacy = readFile(path.join(__dirname, 'views', 'Disclaimer.html'));
  res.send(header + privacy + footer);
});

// Route to serve the pets page
app.get('/pets', (req, res) => {
  const header = readFile(path.join(__dirname, 'views', 'header.html'));
  const footer = readFile(path.join(__dirname, 'views', 'footer.html'));
  const pets = readFile(path.join(__dirname, 'views', 'Pets.html'));
  res.send(header + pets + footer);
});

// Route to serve the find dog or cat page
app.get('/find-dog-cat', (req, res) => {
  const header = readFile(path.join(__dirname, 'views', 'header.html'));
  const footer = readFile(path.join(__dirname, 'views', 'footer.html'));
  const findDogCat = readFile(path.join(__dirname, 'views', 'Find_DOG_CAT.html'));
  res.send(header + findDogCat + footer);
});

// Route to serve the cat care page
app.get('/cat-care', (req, res) => {
  const header = readFile(path.join(__dirname, 'views', 'header.html'));
  const footer = readFile(path.join(__dirname, 'views', 'footer.html'));
  const catCare = readFile(path.join(__dirname, 'views', 'Cat_Care.html'));
  res.send(header + catCare + footer);
});

// Route to serve the have a pet to give away page
app.get('/rehabilitate', sessionMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'rehabilitate.html'));
});

// Route to serve the contact us page
app.get('/contact-us', (req, res) => {
  const header = readFile(path.join(__dirname, 'views', 'header.html'));
  const footer = readFile(path.join(__dirname, 'views', 'footer.html'));
  const contactUs = readFile(path.join(__dirname, 'views', 'Contact_Us.html'));
  res.send(header + contactUs + footer);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
