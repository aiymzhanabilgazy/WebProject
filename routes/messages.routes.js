const router = require('express').Router();
const { getDB } = require('../configuration/db');
const { ObjectId } = require('mongodb');
const isAuthenticated = require('../middleware/isAuthenticated');

// получить мои сообщения
router.get('/', isAuthenticated, async (req, res) => {
  const db = getDB();
  const userId = req.session.userId;

  const messages = await db.collection('messages').aggregate([
    {
      $match: {
        $or: [
          { from: userId },
          { to: userId }
        ]
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'from',
        foreignField: '_id',
        as: 'sender'
      }
    },
    { $unwind: '$sender' },
    { $sort: { createdAt: 1 } }
  ]).toArray();

  res.json(messages);
});



// отправить сообщение
router.post('/', isAuthenticated, async (req, res) => {
  const { to, text } = req.body;

  if (!to || !text) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const db = getDB();

  await db.collection('messages').insertOne({
    from: req.session.userId,
    to: new ObjectId(to),
    text,
    createdAt: new Date()
  });

  res.sendStatus(201);
});

module.exports = router;
