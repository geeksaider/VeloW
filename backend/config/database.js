const mysql = require('mysql2/promise');

// Create a connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'velo',
  password: process.env.DB_PASSWORD || 'velopassword',
  database: process.env.DB_NAME || 'velo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = { db };
