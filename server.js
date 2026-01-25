const express = require('express');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require("mongodb");
const { connectDB, getDB } = require('./db');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URI;



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
  const { name, email,password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const db = getDB();
    const result = await db.collection('users').insertOne({
      name,
      email,
      password
    });

    res.status(201).json({
      _id: result.insertedId,
      name,
      email
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const { name, email } = req.body;

  if (!name && !email) {
    return res.status(400).json({ error: 'Nothing to update' });
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;

  try {
    const db = getDB();
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  try {
    const db = getDB();
    const result = await db
      .collection('users')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
//Post CRUD
// POSTS CRUD (для pins / ideas / locations)

app.get('/api/posts', async (req, res) => {
  const db = getDB();
  const posts = await db.collection('posts').find().toArray();
  res.json(posts);
});

app.post('/api/posts', async (req, res) => {
  const { title, description, imageUrl, category, author, userId } = req.body;

  const db = getDB();
  const result = await db.collection('posts').insertOne({
    title,
    description,
    imageUrl,
    category,
    author,
    userId,
    createdAt: new Date()
  });

  res.status(201).json(result);
});

app.put('/api/posts/:id', async (req, res) => {
  const db = getDB();
  await db.collection('posts').updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.json({ message: 'Post updated' });
});

app.delete('/api/posts/:id', async (req, res) => {
  const db = getDB();
  await db.collection('posts').deleteOne(
    { _id: new ObjectId(req.params.id) }
  );
  res.sendStatus(204);
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
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
