const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'notes'
});

async function init() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS notes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      text TEXT NOT NULL,
      priority VARCHAR(255),
      createdAt DATETIME
    )
  `;
  const conn = await pool.getConnection();
  await conn.query(createTableQuery);
  conn.release();
}

init();

module.exports = pool;
