// ================================
// 📁 services/sqlRunner.js
// ================================
const sqlite3 = require("sqlite3").verbose();

// connect to your database
const db = new sqlite3.Database("./db/database.db", (err) => {
  if (err) console.error("❌ Error opening database:", err.message);
  else console.log("✅ Connected to SQLite database");
});

// ✅ Safe read-only SELECT query executor
async function runSelectQuery(sql) {
  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("SQL Execution Error:", err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// ✅ Optional: ensure only SELECTs can run here too
function validateSelectSQL(sql) {
  if (typeof sql !== "string") return false;
  const upper = sql.trim().toUpperCase();
  if (!upper.startsWith("SELECT")) return false;

  const forbidden = [
    "INSERT", "UPDATE", "DELETE", "DROP", "ALTER",
    "CREATE", "ATTACH", "DETACH", "PRAGMA", "--", "/*", ";", "EXEC"
  ];
  return !forbidden.some(t => upper.includes(t));
}

// ✅ Export both
module.exports = { runSelectQuery, validateSelectSQL };
