const router = require('express').Router();
const bcrypt = require('bcrypt');
const { getDB } = require('../configuration/db');
const { ObjectId } = require('mongodb');
const isAuthenticated = require('../middleware/isAuthenticated');

router.get('/', isAuthenticated, async (req, res) => {
  const db = getDB();
  const users = await db.collection('users').find().toArray();
  res.json(users);
});

router.post('/', async (req, res) => {
  const db = getDB();
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const result = await db.collection('users').insertOne({
    ...req.body,
    role: 'user',
    password: hashedPassword,
    createdAt: new Date()
  });

  res.status(201).json(result);
});

router.delete('/:id', async (req, res) => {
  const db = getDB();
  await db.collection('users').deleteOne({
    _id: new ObjectId(req.params.id)
  });
  res.sendStatus(204);
});

module.exports = router;
