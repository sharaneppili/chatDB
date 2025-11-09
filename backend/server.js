// ================================
// 🧠 Ask Your Database – Backend
// ================================
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

//const { getAllTables, getTableSchema } = require('./services/schema');
const { generateSQLWithGemini } = require('./services/gemini');
const { getAllTables, getTableSchema, getDatabaseSchema } = require("./services/schema");

const { runSelectQuery, validateSelectSQL } = require('./services/sqlRunner');


dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());


// ✅ POST /api/ask
// app.post('/api/ask', async (req, res) => {
//   try {
//     const { question } = req.body;

//     if (!question || !question.trim()) {
//       return res.status(400).json({ error: 'Question is required.' });
//     }

//     // 1️⃣ Get all table names from the database
//     const tables = await getAllTables();
//     if (!tables || tables.length === 0) {
//       return res.status(400).json({ error: 'No tables found in database.' });
//     }

//     // 2️⃣ Try to detect which table the user is referring to
//     const lowerQ = question.toLowerCase();
//     let selectedTable = null;

//     // Direct table name match
//     for (const t of tables) {
//       const tl = t.toLowerCase();
//       if (lowerQ.includes(tl)) {
//         selectedTable = t;
//         break;
//       }
//     }

//     // Fallback: handle plural/singular differences
//     if (!selectedTable) {
//       for (const t of tables) {
//         const tl = t.toLowerCase();
//         const stem = tl.endsWith('s') ? tl.slice(0, -1) : tl + 's';
//         if (lowerQ.includes(stem)) {
//           selectedTable = t;
//           break;
//         }
//       }
//     }

//     if (!selectedTable) {
//       return res.status(400).json({
//         error: `Couldn't detect which table to use. Please mention a table name like: ${tables.join(', ')}.`,
//       });
//     }

//     // 3️⃣ Get schema for that table
//     const tableSchema = await getTableSchema(selectedTable);

//     // 4️⃣ Send question + schema to Gemini to generate SQL
//     const sql = await generateSQLWithGemini({ question, schema: tableSchema });

//     // 5️⃣ Validate that SQL is safe
//     if (!validateSelectSQL(sql)) {
//       return res.status(400).json({ error: 'Only SELECT queries are allowed.' });
//     }

//     // 6️⃣ Execute SQL and return the result
//     const rows = await runSelectQuery(sql);

//     res.json({
//       sql,
//       rows,
//       tableUsed: selectedTable,
//     });

//   } catch (error) {
//     console.error('❌ API /api/ask error:', error);
//     res.status(500).json({ error: error.message || 'Server error' });
//   }
// });
//updated one
// app.post("/api/ask", async (req, res) => {
//   try {
//     const { question } = req.body;
//     if (!question) {
//       return res.status(400).json({ error: "No question provided" });
//     }

//     // 1️⃣ Get schema
//     const schema = await getDatabaseSchema();

//     // 2️⃣ Get SQL and display info from Gemini
//     const { sql, display, chartType, x, y } = await generateSQLWithGemini({
//       question,
//       schema,
//     });

//     if (!sql || !sql.trim().toUpperCase().startsWith("SELECT")) {
//       return res.status(400).json({ error: "Invalid or missing SQL query" });
//     }

//     // 3️⃣ Validate SQL
//     if (!validateSelectSQL(sql)) {
//       return res.status(400).json({ error: "Only SELECT queries are allowed" });
//     }

//     // 4️⃣ Execute safely
//     const rows = await runSelectQuery(sql);

//     // 5️⃣ If no rows, still return success (frontend can show “no data”)
//     return res.json({
//       sql,
//       rows: rows || [],
//       display: display || "table",
//       chartType: chartType || null,
//       x: x || null,
//       y: y || null,
//     });
//   } catch (error) {
//     console.error("❌ API /api/ask error:", error.message);
//     res.status(500).json({ error: "Server error, could not process query" });
//   }
// });
app.post("/api/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "No question provided" });
    }

    // 1️⃣ Get schema
    const schema = await getDatabaseSchema();

    // 2️⃣ Ask Gemini for SQL + visualization info
    const geminiResult = await generateSQLWithGemini({ question, schema });

    if (!geminiResult.sql) {
      console.log("⚠️ Gemini didn't return SQL");
      return res.json({
        sql: "",
        rows: [],
        display: "table",
        chartType: null,
        x: null,
        y: null,
      });
    }

    const sql = geminiResult.sql;
    const display = geminiResult.display || "table";
    const chartType = geminiResult.chartType || null;
    const x = geminiResult.x || null;
    const y = geminiResult.y || null;

    // 3️⃣ Only allow SELECT
    if (!validateSelectSQL(sql)) {
      console.log("⛔ Blocked non-SELECT query:", sql);
      return res.json({
        sql,
        rows: [],
        display: "table",
        chartType: null,
        x: null,
        y: null,
      });
    }

    // 4️⃣ Execute SQL safely
    const rows = await runSelectQuery(sql);
    console.log("✅ Query executed successfully, Rows:", rows?.length || 0);

    // 5️⃣ Always send a proper response (no error thrown)
    return res.json({
      sql,
      rows: rows || [],
      display,
      chartType,
      x,
      y,
    });
  } catch (error) {
    console.error("❌ API /api/ask error:", error);
    // still send something valid so frontend doesn’t break
    return res.json({
      sql: "",
      rows: [],
      display: "table",
      chartType: null,
      x: null,
      y: null,
    });
  }
});



// ✅ Health check or schema endpoint
app.get('/api/schema', async (req, res) => {
  try {
    const tables = await getAllTables();
    const schemas = [];
    for (const t of tables) {
      const schema = await getTableSchema(t);
      schemas.push(schema);
    }
    res.json({ tables: schemas });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
