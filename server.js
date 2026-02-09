const express = require('express');
require('dotenv').config();
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const passport = require('passport');
const { connectDB } = require('./configuration/db');
require('./configuration/passport');

const app = express();
const PORT = process.env.PORT || 3000;

// static
app.use(express.static('public'));
app.use('/images', express.static('images'));

// body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret123',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60
  }
}));

// passport
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/auth', require('./routes/auth.routes'));
app.use('/api/posts', require('./routes/posts.routes'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/messages', require('./routes/messages.routes'));


// pages
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
);
app.get('/auth', (req, res) =>
  res.sendFile(path.join(__dirname, 'views', 'auth.html'))
);
app.get('/about', (req, res) =>
  res.sendFile(path.join(__dirname, 'views', 'about.html'))
);
app.get('/creativity', (req, res) =>
  res.sendFile(path.join(__dirname, 'views', 'creativity.html'))
);
app.get('/locations', (req, res) =>
  res.sendFile(path.join(__dirname, 'views', 'locations.html'))
);
app.get('/contact', (req, res) =>
  res.sendFile(path.join(__dirname, 'views', 'contact.html'))
);
app.get('/my-posts', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'my-posts.html'));
});
app.get('/likes', (req, res) =>
  res.sendFile(path.join(__dirname, 'views', 'likes.html'))
);
app.get('/saved', (req, res) =>
  res.sendFile(path.join(__dirname, 'views', 'saved.html'))
);
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});
app.get('/messages', (req, res) =>
  res.sendFile(path.join(__dirname, 'views', 'messages.html'))
);
app.get('/admin-user', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin-user.html'));
});




// 404
app.use((req, res) => {
  if (req.url.startsWith('/api')) {
    res.status(404).json({ error: 'API route not found' });
  } else {
    res.status(404).send('<h2>404 - Page Not Found</h2><a href="/">Go Home</a>');
  }
});

// start
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
