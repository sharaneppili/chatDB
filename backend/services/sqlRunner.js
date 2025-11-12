
const { getDB } = require("./db");

// ✅ Safe read-only SELECT query executor (supports SQLite + MySQL)
async function runSelectQuery(sql) {
  const { type, conn } = await getDB();

  return new Promise((resolve, reject) => {
    if (type === "mysql") {
      // 🟢 MySQL Query Execution
      conn.query(sql)
        .then(([rows]) => resolve(rows))
        .catch((err) => {
          console.error("❌ MySQL Query Error:", err.message);
          reject(err);
        });
    } else {
      // 🟣 SQLite Query Execution
      conn.all(sql, [], (err, rows) => {
        if (err) {
          console.error("❌ SQLite Query Error:", err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    }
  });
}

// ✅ Validation Function to Allow Only Safe SELECT Queries
function validateSelectSQL(sql) {
  if (typeof sql !== "string" || !sql.trim()) return false;

  const upper = sql.trim().toUpperCase();

  // Must start with SELECT
  if (!upper.startsWith("SELECT")) return false;

  // Disallow destructive keywords
  const forbidden = [
    "INSERT", "UPDATE", "DELETE", "DROP", "ALTER",
    "CREATE", "ATTACH", "DETACH", "PRAGMA", "EXEC"
  ];

  // Clean out comments and trailing semicolons
  const cleaned = upper.replace(/;|--.*|\/\*.*\*\//g, "");

  return !forbidden.some(t => cleaned.includes(t));
}

module.exports = { runSelectQuery, validateSelectSQL };
