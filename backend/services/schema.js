const sqlite3 = require('sqlite3').verbose();
const DB_PATH = './db/database.db';

function openDb() {
  return new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY);
}

// Get all table names
function getAllTables() {
  const db = openDb();
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`,
      [],
      (err, rows) => {
        db.close();
        if (err) return reject(err);
        resolve(rows.map(r => r.name));
      }
    );
  });
}

// Get schema (columns) of one specific table
function getTableSchema(tableName) {
  const db = openDb();
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(${tableName});`, [], (err, columns) => {
      db.close();
      if (err) return reject(err);
      const cols = columns.map(c => c.name);
      resolve({ name: tableName, columns: cols });
    });
  });
}

module.exports = { getAllTables, getTableSchema };
