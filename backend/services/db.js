// ================================
// 📁 services/db.js
// ================================
const sqlite3 = require("sqlite3").verbose();
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

let cachedDB = null;

// ✅ Universal DB connector
async function getDB() {
  // Reuse same connection if already established
  if (cachedDB) return cachedDB;

  const type = process.env.DB_TYPE || "sqlite";

  if (type === "mysql") {
    // 🟢 MySQL Connection
    const conn = await mysql.createConnection({
      host: process.env.MYSQL_HOST || "localhost",
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "chatdb",
    });
    console.log("✅ Connected to MySQL database");
    cachedDB = { type, conn };
    return cachedDB;
  } else {
    // 🟣 SQLite Connection
    const dbPath = process.env.SQLITE_PATH || "./db/database.db";
    const conn = new sqlite3.Database(dbPath, (err) => {
      if (err) console.error("❌ Error opening SQLite database:", err.message);
      else console.log("✅ Connected to SQLite database");
    });
    cachedDB = { type, conn };
    return cachedDB;
  }
}

module.exports = { getDB };
