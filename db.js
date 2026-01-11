const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: '12345678',
  database: 'WEB_APP'
});

pool.connect()
  .then(() => console.log('PostgreSQL connected'))
  .catch(err => console.error('DB error:', err));

module.exports = pool;
