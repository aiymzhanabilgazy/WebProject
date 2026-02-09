const router = require('express').Router();
const { getDB } = require('../configuration/db');
const { ObjectId } = require('mongodb');
const isAuthenticated = require('../middleware/isAuthenticated');
const requireAdmin = require('../middleware/requireAdmin');

router.get('/users', isAuthenticated, requireAdmin, async (req, res) => {
  const db = getDB();

  const users = await db
    .collection('users')
    .find({}, { projection: { password: 0 } })
    .toArray();

  res.json(users);
});

router.get('/users/:id', isAuthenticated, requireAdmin, async (req, res) => {
  const db = getDB();
  const userId = req.params.id;

  const userObjectId = new ObjectId(userId);

  const user = await db.collection('users').findOne(
    { _id: userObjectId },
    { projection: { password: 0 } }
  );

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const posts = await db.collection('posts')
    .find({ userId: userObjectId })
    .sort({ createdAt: -1 })
    .toArray();

  res.json({ user, posts });
});

module.exports = router;
