const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const pool = require('./db');

app.use(express.static('public'));
app.use('/images', express.static('images'));

//middlewares
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users ORDER BY id ASC'
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;

  // validation
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
app.put('/api/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [name, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.delete('/api/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


//html pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get("/auth", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "auth.html"));
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
  if (req.url.startsWith('/api')) {
    res.status(404).json({ error: 'API route not found' });
  } else {
    res.status(404).send(`
      <h2>404 - Page Not Found</h2>
      <a href="/">Go Home</a>
    `);
  }
});


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});


/*app.get('/api/info', (req, res) => {
  res.json({
    project: 'Assignment 2',
    description: 'Server-side request handling in Express.js',
    author: 'Student',
    status: 'In progress'
  });
});

app.post('/contact', (req, res) => {
  const { fname, lname, email, message } = req.body;

  if (!fname || !lname || !email || !message) {
    return res.status(400).send('<h2>400 - All fields are required</h2>');
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

app.get('/search', (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).send('<h2>400 - Missing search query</h2>');
  }

  res.send(`
    <h2>Search Page</h2>
    <p>You searched for: <strong>${q}</strong></p>
    <a href="/">Back to Home</a>
  `);
});
app.get('/item/:id', (req, res) => {
  const { id } = req.params;

  res.send(`
    <h2>Item Page</h2>
    <p>Item ID: <strong>${id}</strong></p>
    <a href="/">Back to Home</a>
  `);
}); */