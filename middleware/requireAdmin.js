const { getDB } = require('../configuration/db');
const { ObjectId } = require('mongodb');

module.exports = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const db = getDB();
  const user = await db.collection('users').findOne({
    _id: new ObjectId(req.session.userId)
  });

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }

  next();
};
