const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');


app.use(express.static('public'));
app.use('/images', express.static('images'));

app.use(express.urlencoded({ extended: true })); //middleware

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`); //custom logger middleware(HTTP method+URL)
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views','index.html'));
});





app.get('/item/:id', (req, res) => {
  const { id } = req.params;

  res.send(`
    <h2>Item Page</h2>
    <p>Item ID: <strong>${id}</strong></p>
    <a href="/">Back to Home</a>
  `);
});





app.post('/contact', (req, res) => {
  const { fname, lname, email, message } = req.body;

  if (!fname || !lname || !email || !message) {
    return res.status(400).send('<h2>400 - All fields are required</h2>'); //validation
  }

  const formData = {
    firstName: fname,
    lastName: lname,
    email,
    message,
    date: new Date().toISOString()
  };

  fs.readFile('data.json', 'utf8', (err, data) => {
    let entries = [];

    if (!err && data) {
      entries = JSON.parse(data);
    }

    entries.push(formData);

    fs.writeFile('data.json', JSON.stringify(entries, null, 2), err => {
      if (err) {
        res.send('<h2>Error saving data</h2>');
      } else {
        res.send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>Success</title>
            <link rel="stylesheet" href="/contact.css">
          </head>
          <body class="success-page">
            <div class="success-box">
              <h2>Form submitted successfully</h2>
              <p>First Name: ${fname}</p>
              <p>Last Name: ${lname}</p>
              <p>Email: ${email}</p>
              <p>Message: ${message}</p>
              <a href="/contact">Back</a>
            </div>
          </body>
          </html>
        `);
      }
    });
  });
});



app.get('/api/info', (req, res) => {
  res.json({
    project: 'Assignment 2',
    description: 'Server-side request handling in Express.js',
    author: 'Student',
    status: 'In progress'
  });
});

app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/views/about.html');
});

app.get('/creativity', (req, res) => {
  res.sendFile(__dirname + '/views/creativity.html');
});

app.get('/locations', (req, res) => {
  res.sendFile(__dirname + '/views/locations.html');
});

app.get('/contact', (req, res) => {
  res.sendFile(__dirname + '/views/contact.html');
});

//404 handling
app.use((req, res) => {
  res.status(404).send(` 
    <h2>404 - Page Not Found</h2>
    <a href="/">Go Home</a>
  `);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});