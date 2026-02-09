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
    .find({}, { projection: { password: 0 } }) // 🔒 не отдаём пароль
    .toArray();

  res.json(users);
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
