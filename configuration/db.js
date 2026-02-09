const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(); // имя БД уже есть в URI
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

module.exports = {
  connectDB,
  getDB
};
