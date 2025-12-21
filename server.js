const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.static('public'));
app.use('/images', express.static('images'));
app.use(express.urlencoded({ extended: true }));

app.post('/contact', (req, res) => {
  const { fname, lname, email, message } = req.body;

  const formData = {
    firstName: fname,
    lastName: lname,
    email: email,
    message: message,
    date: new Date().toISOString()
  };

  fs.readFile('data.json', 'utf8', (err, data) => {
    let entries = [];

    if (!err && data) {
      entries = JSON.parse(data);
    }

    entries.push(formData);

    fs.writeFile(
      'data.json',
      JSON.stringify(entries, null, 2),
      (err) => {
        if (err) {
          res.send('<h2>Error saving data</h2>');
        } else {
          res.send(`
            <h2>Form submitted successfully</h2>
            <p>First Name: ${fname}</p>
            <p>Last Name: ${lname}</p>
            <p>Email: ${email}</p>
            <p>Message: ${message}</p>
            <a href="/contact">Back</a>
          `);
        }
      }
    );
  });
}); 

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
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

app.use((req, res) => {
  res.status(404).send(`
    <h2>404 - Page Not Found</h2>
    <a href="/">Go Home</a>
  `);
});

app.listen(3000, () =>
  console.log('Server running on http://localhost:3000')
);
