const router = require('express').Router();
const { getDB } = require('../configuration/db');
const { ObjectId } = require('mongodb');
const isAuthenticated = require('../middleware/isAuthenticated');
const requireAdmin = require('../middleware/requireAdmin');

// 👥 GET ALL USERS
router.get('/users', isAuthenticated, requireAdmin, async (req, res) => {
  const db = getDB();

  const users = await db
    .collection('users')
    .find({}, { projection: { password: 0 } })
    .toArray();

  res.json(users);
});

// 👤 GET ONE USER + HIS POSTS
router.get('/users/:id', isAuthenticated, requireAdmin, async (req, res) => {
  const db = getDB();
  const userObjectId = new ObjectId(req.params.id);
  const userIdString = req.params.id;

  const user = await db.collection('users').findOne(
    { _id: userObjectId },
    { projection: { password: 0 } }
  );

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const posts = await db
    .collection('posts')
    .find({ userId: userIdString }) // 👈 ВАЖНО
    .sort({ createdAt: -1 })
    .toArray();

  res.json({ user, posts });
});

// 🔁 UPDATE USER ROLE
router.patch('/users/:id/role', isAuthenticated, requireAdmin, async (req, res) => {
  const db = getDB();

  await db.collection('users').updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { role: req.body.role } }
  );

  res.json({ message: 'Role updated' });
});

// 🗑 DELETE USER
router.delete('/users/:id', isAuthenticated, requireAdmin, async (req, res) => {
  const db = getDB();

  await db.collection('users').deleteOne({
    _id: new ObjectId(req.params.id)
  });

  res.sendStatus(204);
});

module.exports = router;
