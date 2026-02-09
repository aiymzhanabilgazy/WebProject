const router = require('express').Router();
const { getDB } = require('../configuration/db');
const { ObjectId } = require('mongodb');
const isAuthenticated = require('../middleware/isAuthenticated');

/* =========================
   LIKED POSTS
========================= */
router.get('/liked', isAuthenticated, async (req, res) => {
  const db = getDB();
  const userId = req.session.userId;

  const posts = await db.collection('posts')
    .find({ likes: userId })
    .toArray();

  res.json(posts);
});

/* =========================
   SAVED POSTS (FIXED)
========================= */
router.get('/saved', isAuthenticated, async (req, res) => {
  const db = getDB();
  const userId = req.session.userId;

  const posts = await db.collection('posts')
    .find({ saved: userId }) // ✅ ВАЖНО
    .toArray();

  res.json(posts);
});

/* =========================
   MY POSTS
========================= */
router.get('/my', isAuthenticated, async (req, res) => {
  const db = getDB();

  const posts = await db.collection('posts')
    .find({ userId: req.session.userId })
    .sort({ createdAt: -1 })
    .toArray();

  res.json(posts);
});

/* =========================
   ALL POSTS (PUBLIC)
========================= */
router.get('/', async (req, res) => {
  const db = getDB();
  const posts = await db.collection('posts')
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  res.json({ posts });
});

/* =========================
   ONE POST
========================= */
router.get('/:id', async (req, res) => {
  const db = getDB();
  const post = await db.collection('posts').findOne({
    _id: new ObjectId(req.params.id)
  });

  res.json(post);
});

/* =========================
   CREATE POST (IMAGE URL)
========================= */
router.post('/', isAuthenticated, async (req, res) => {
  const db = getDB();
  const { author, imageUrl, description, category } = req.body;

  if (!author || !imageUrl || !description) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const result = await db.collection('posts').insertOne({
    author,
    imageUrl,
    description,
    category,
    userId: req.session.userId,
    likes: [],
    saved: [],
    createdAt: new Date()
  });

  res.status(201).json(result);
});

/* =========================
   UPDATE POST (OWNER ONLY)
========================= */
router.put('/:id', isAuthenticated, async (req, res) => {
  const db = getDB();
  const postId = new ObjectId(req.params.id);

  const post = await db.collection('posts').findOne({ _id: postId });

  if (!post || post.userId !== req.session.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await db.collection('posts').updateOne(
    { _id: postId },
    { $set: req.body }
  );

  res.json({ message: 'Post updated' });
});

/* =========================
   DELETE POST (OWNER ONLY)
========================= */
router.delete('/:id', isAuthenticated, async (req, res) => {
  const db = getDB();
  const postId = new ObjectId(req.params.id);

  const post = await db.collection('posts').findOne({ _id: postId });

  if (!post || post.userId !== req.session.userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await db.collection('posts').deleteOne({ _id: postId });
  res.sendStatus(204);
});

/* =========================
   LIKE
========================= */
router.post('/:id/like', isAuthenticated, async (req, res) => {
  const db = getDB();
  const postId = new ObjectId(req.params.id);
  const userId = req.session.userId;

  const post = await db.collection('posts').findOne({ _id: postId });
  const liked = post.likes.includes(userId);

  await db.collection('posts').updateOne(
    { _id: postId },
    liked
      ? { $pull: { likes: userId } }
      : { $addToSet: { likes: userId } }
  );

  res.json({ liked: !liked });
});

/* =========================
   SAVE
========================= */
router.post('/:id/save', isAuthenticated, async (req, res) => {
  const db = getDB();
  const postId = new ObjectId(req.params.id);
  const userId = req.session.userId;

  const post = await db.collection('posts').findOne({ _id: postId });
  const saved = post.saved.includes(userId);

  await db.collection('posts').updateOne(
    { _id: postId },
    saved
      ? { $pull: { saved: userId } }
      : { $addToSet: { saved: userId } }
  );

  res.json({ saved: !saved });
});

module.exports = router;
