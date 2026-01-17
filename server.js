const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const { ObjectId } = require('mongodb');
const { connectDB, getDB } = require('./db');

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
    const db = getDB();

    const filter = {};
    if (req.query.name) {
      filter.name = req.query.name;
    }

    const sort = {};
    if (req.query.sort) {
      sort[req.query.sort] = req.query.order === 'desc' ? -1 : 1;
    }

    let projection = {};
    if (req.query.fields) {
      req.query.fields.split(',').forEach(field => {
        projection[field] = 1;
      });
    }

    const users = await db
      .collection('users')
      .find(filter)
      .project(projection)
      .sort(sort)
      .toArray();

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  try {
    const db = getDB();
    const user = await db
      .collection('users')
      .findOne({ _id: new ObjectId(id) });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const db = getDB();
    const result = await db.collection('users').insertOne({ name, email });

    res.status(201).json({
      _id: result.insertedId,
      name,
      email
    });
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

//404 handler
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

// start the server
connectDB().then(() => {
  app.listen(3000, () => {
    console.log(`Server running on http://localhost:3000`);
  });
});
