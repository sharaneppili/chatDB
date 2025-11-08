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
 // console.log("🧠 Gemini generated SQL:\n", sql);

  if (typeof sql !== "string" || !sql.trim()) return false;

  const upper = sql.trim().toUpperCase();

  // ✅ Allow SELECT queries even with trailing semicolons or comments
  if (!upper.startsWith("SELECT")) return false;

  // 🚫 Disallow destructive keywords (still safe)
  const forbidden = [
    "INSERT", "UPDATE", "DELETE", "DROP", "ALTER",
    "CREATE", "ATTACH", "DETACH", "PRAGMA", "EXEC"
  ];

  // ✅ Ignore harmless semicolons or comments
  const cleaned = upper.replace(/;|--.*|\/\*.*\*\//g, "");

  return !forbidden.some(t => cleaned.includes(t));
}


// ✅ Export both
module.exports = { runSelectQuery, validateSelectSQL };
