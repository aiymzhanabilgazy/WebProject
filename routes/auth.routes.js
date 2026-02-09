const router = require('express').Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const { getDB } = require('../configuration/db');
const { ObjectId } = require('mongodb');

// OAuth
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth' }),
  (req, res) => {
    req.session.userId = req.user._id;
    res.redirect('/');
  }
);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth' }),
  (req, res) => {
    req.session.userId = req.user._id;
    res.redirect('/');
  }
);

// auth me
router.get('/me', async (req, res) => {
  if (!req.session.userId) return res.status(401).json(null);

  const db = getDB();
  const user = await db.collection('users').findOne(
    { _id: new ObjectId(req.session.userId) },
    { projection: { password: 0 } }
  );

  res.json(user);
});

// login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const db = getDB();

  const user = await db.collection('users').findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });

  req.session.userId = user._id;
  res.json({ user });
});

// logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

module.exports = router;
