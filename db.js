const { MongoClient } = require('mongodb');

const url =
  "mongodb+srv://aiymzhan_mongo:webpassword123@cluster0.wolwvj3.mongodb.net/web_app?retryWrites=true&w=majority";
const dbName = 'web_app';

const client = new MongoClient(url);

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
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
