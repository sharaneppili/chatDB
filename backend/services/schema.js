const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// ✅ Define your SQLite database path
const dbPath = path.resolve(__dirname, "../db/database.db");

// ✅ Connect to database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("❌ Database connection failed:", err.message);
  else console.log("✅ Connected to SQLite database");
});

// 🔹 Get all table names
function getAllTables() {
  return new Promise((resolve, reject) => {
    db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, tables) => {
      if (err) reject(err);
      else resolve(tables.map((t) => t.name));
    });
  });
}

// 🔹 Get schema (column names) for a given table
function getTableSchema(tableName) {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(${tableName});`, (err, columns) => {
      if (err) reject(err);
      else resolve(columns.map((col) => col.name));
    });
  });
}

// 🔹 Build full database schema (all tables + their columns)
async function getDatabaseSchema() {
  const tables = await getAllTables();
  const schema = { tables: [] };

  for (const table of tables) {
    const columns = await getTableSchema(table);
    schema.tables.push({ name: table, columns });
  }

  return schema;
}

module.exports = { getAllTables, getTableSchema, getDatabaseSchema };
