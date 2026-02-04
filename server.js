const express = require('express');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const MongoStore = require('connect-mongo').default;
const { connectDB, getDB } = require('./db');

const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');

const app = express();

const PORT = process.env.PORT || 3000;

// static
app.use(express.static('public'));
app.use('/images', express.static('images'));

// body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret123',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  }),
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60
  }
}));

// =======================
// SESSION SETUP
// =======================

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret123',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  }),
  cookie: {
    httpOnly: true,
    secure: false, // true when https
    maxAge: 1000 * 60 * 60
  }
}));

// =======================
// AUTH MIDDLEWARE
// =======================

function isAuthenticated(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

// =======================
// USERS CRUD
// =======================

app.get('/api/users', async (req, res) => {
  try {
    const db = getDB();
    const filter = {};

    if (req.query.name) filter.name = req.query.name;
    if (req.query.email) filter.email = req.query.email;

    const users = await db.collection('users').find(filter).toArray();
    res.status(200).json(users);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  try {
    const db = getDB();
    const user = await db.collection('users').findOne({
      _id: new ObjectId(req.params.id)
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/users', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }

  try {
    const db = getDB();

    const existing = await db.collection('users').findOne({ email });
    if (existing) return res.status(400).json({ error: 'User exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date()
    });

    res.status(201).json({
      _id: result.insertedId,
      name,
      email
    });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const updateData = {};
  if (req.body.name) updateData.name = req.body.name;
  if (req.body.email) updateData.email = req.body.email;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'Nothing to update' });
  }

  try {
    const db = getDB();
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    if (!result.matchedCount) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  try {
    const db = getDB();
    const result = await db.collection('users').deleteOne({
      _id: new ObjectId(req.params.id)
    });

    if (!result.deletedCount) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.sendStatus(204);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// =======================
// POSTS CRUD (PROTECTED)
// =======================

app.get('/api/posts', async (req, res) => {
  const db = getDB();
  const posts = await db.collection('posts').find().toArray();
  res.json(posts);
});

app.get('/api/posts/:id', async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const db = getDB();
  const post = await db.collection('posts').findOne({
    _id: new ObjectId(req.params.id)
  });

  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

app.post('/api/posts', isAuthenticated, async (req, res) => {
  const db = getDB();

  const result = await db.collection('posts').insertOne({
    ...req.body,
    createdAt: new Date(),
    userId: req.session.userId
  });

  res.status(201).json(result);
});

app.put('/api/posts/:id', isAuthenticated, async (req, res) => {
  const db = getDB();
  await db.collection('posts').updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );

  res.json({ message: 'Post updated' });
});

app.delete('/api/posts/:id', isAuthenticated, async (req, res) => {
  const db = getDB();
  await db.collection('posts').deleteOne({
    _id: new ObjectId(req.params.id)
  });

  res.sendStatus(204);
});

// =======================
// LOGIN
// =======================

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = getDB();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    req.session.userId = user._id;

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// =======================
// HTML PAGES
// =======================

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/auth', (req, res) => res.sendFile(path.join(__dirname, 'views', 'auth.html')));
app.get('/about', (req, res) => res.sendFile(__dirname + '/views/about.html'));
app.get('/creativity', (req, res) => res.sendFile(__dirname + '/views/creativity.html'));
app.get('/locations', (req, res) => res.sendFile(__dirname + '/views/locations.html'));
app.get('/contact', (req, res) => res.sendFile(__dirname + '/views/contact.html'));

// =======================
// 404
// =======================

app.use((req, res) => {
  if (req.url.startsWith('/api')) {
    res.status(404).json({ error: 'API route not found' });
  } else {
    res.status(404).send('<h2>404 - Page Not Found</h2><a href="/">Go Home</a>');
  }
});

// =======================
// START SERVER
// =======================

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});