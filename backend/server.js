// // // ================================
// // 🧠 ChatDB – Backend Server
// // ================================
// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const { generatePrediction, inversePrediction } = require("./services/predict");


// const { generateSQLWithGemini } = require("./services/gemini");
// const { getAllTables, getTableSchema, getDatabaseSchema } = require("./services/schema");
// const { runSelectQuery, validateSelectSQL } = require("./services/sqlRunner");
// const { analyzeAndGenerateInsights } = require("./services/insights");

// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// /* ==========================================================
//    🧠 Main Endpoint: /api/ask 
//    Converts natural language → SQL → executes → returns result
//    ========================================================== */
// // app.post("/api/ask", async (req, res) => {
// //   try {
// //     const { question } = req.body;
// //     if (!question || !question.trim()) {
// //       console.warn("⚠️ Missing question in request");
// //       return res.status(400).json({ error: "No question provided." });
// //     }

// //     // 1️⃣ Get the complete database schema
// //     const schema = await getDatabaseSchema();

// //     // 2️⃣ Ask Gemini to generate SQL + chart suggestions
// //     const geminiResult = await generateSQLWithGemini({ question, schema });

// //     // ✅ Handle Gemini errors cleanly
// //     if (geminiResult.error) {
// //       console.log("🔴 Gemini reported:", geminiResult.error);
// //       return res.status(400).json({ error: geminiResult.error });
// //     }

// //     const sql = geminiResult.sql || "";
// //     const display = geminiResult.display || "table";
// //     const chartType = geminiResult.chartType || null;
// //     const x = geminiResult.x || null;
// //     const y = geminiResult.y || null;

// //     // 3️⃣ Only allow SELECT queries
// //     if (!validateSelectSQL(sql)) {
// //       console.warn("⛔ Blocked unsafe SQL:", sql);
// //       return res.status(400).json({ error: "Only SELECT queries are allowed." });
// //     }

// //     // 4️⃣ Ensure all referenced tables exist in DB
// //     const dbSchema = await getDatabaseSchema();
// //     const allTables = dbSchema.tables.map((t) => t.name.toLowerCase());
// //     const sqlLower = sql.toLowerCase();

// //     // detect any table names from FROM or JOIN clauses
// //     const matches = [...sqlLower.matchAll(/\bfrom\s+(\w+)|\bjoin\s+(\w+)/g)];
// //     const usedTables = matches.map((m) => m[1] || m[2]).filter(Boolean);
// //     const invalidTables = usedTables.filter((t) => !allTables.includes(t));

// //     if (invalidTables.length > 0) {
// //       console.warn("❌ Invalid table(s):", invalidTables);
// //       return res
// //         .status(400)
// //         .json({ error: `Table(s) ${invalidTables.join(", ")} not found in database.` });
// //     }

// //     // 5️⃣ Execute SQL safely
// //     const rows = await runSelectQuery(sql);
// //     console.log("✅ Query executed successfully | Rows:", rows?.length || 0);

// //     // 6️⃣ Send consistent structured response
// //     const responsePayload = {
// //       sql,
// //       rows: rows || [],
// //       display,
// //       chartType,
// //       x,
// //       y,
// //     };

// //     console.log("🟢 Backend response payload:", JSON.stringify(responsePayload, null, 2));
// //     return res.json(responsePayload);
// //   } catch (error) {
// //     console.error("❌ API /api/ask error:", error);

// //     // Always send valid JSON to frontend to avoid breaking React
// //     return res.status(500).json({
// //       error: "Server error: could not process query.",
// //       details: error.message || "Unknown error",
// //     });
// //   }
// // });


// app.post("/api/ask", async (req, res) => {
//   try {
//     const { question } = req.body;
//     if (!question) return res.status(400).json({ error: "No question provided." });

//     const intent = detectIntent(question);
//     console.log(`🧭 Detected intent: ${intent}`);

//     if (intent === "predict") {
//       return app._router.handle(req, res, () => {}, "/api/predict", "POST");
//     }

//     if (intent === "inverse") {
//       return app._router.handle(req, res, () => {}, "/api/inverse", "POST");
//     }

//     if (intent === "insight") {
//       return app._router.handle(req, res, () => {}, "/api/insights", "POST");
//     }

//     // Default — standard SQL query flow
//     const schema = await getDatabaseSchema();
//     const geminiResult = await generateSQLWithGemini({ question, schema });

//     if (!geminiResult.sql) {
//       return res.status(400).json({ error: "Couldn't generate SQL." });
//     }

//     const sql = geminiResult.sql;
//     if (!validateSelectSQL(sql)) {
//       return res.status(400).json({ error: "Only SELECT queries allowed." });
//     }

//     const rows = await runSelectQuery(sql);
//     return res.json({
//       sql,
//       rows: rows || [],
//       display: geminiResult.display || "table",
//       chartType: geminiResult.chartType || null,
//       x: geminiResult.x || null,
//       y: geminiResult.y || null,
//     });
//   } catch (error) {
//     console.error("❌ /api/ask error:", error);
//     res.status(500).json({ error: "Server error." });
//   }
// });

// /* ==========================================================
//    💡 /api/insights → Generate insights from query results
//    ========================================================== */
//   //  // 📈 Predict future outcomes
//   //  //const { generatePrediction, inversePrediction } = require("./services/predict");
//   //  const { getDatabaseSchema, getAllTables, getTableSchema } = require("./services/schema");
//   //  const { runSelectQuery } = require("./services/sqlRunner");
//   //  const { generateSQLWithGemini } = require("./services/gemini");
   
//    // 📈 SMART PREDICT — Automatically fetches data for forecasting
//    app.post("/api/predict", async (req, res) => {
//      try {
//        const { question } = req.body;
//        if (!question) return res.status(400).json({ error: "Question is required." });
   
//        // 🔹 Step 1: Get schema from DB
//        const schema = await getDatabaseSchema();
   
//        // 🔹 Step 2: Ask Gemini to generate SQL for the question
//        const { sql, x, y } = await generateSQLWithGemini({ question, schema });
   
//        if (!sql) return res.status(400).json({ error: "Couldn't generate SQL for prediction." });
   
//        // 🔹 Step 3: Run the SQL to fetch data
//        const rows = await runSelectQuery(sql);
//        if (!rows || rows.length === 0)
//          return res.status(400).json({ error: "No data available for prediction." });
   
//        // 🔹 Step 4: Generate prediction
//        const result = await generatePrediction(rows, x || Object.keys(rows[0])[0], y || Object.keys(rows[0])[1]);
   
//        return res.json(result);
//      } catch (error) {
//        console.error("❌ /api/predict error:", error);
//        return res.status(500).json({ error: "Failed to generate prediction." });
//      }
//    });
   
   
//    // 🎯 SMART INVERSE — Auto fetches data and calculates goal-based requirement
//    app.post("/api/inverse", async (req, res) => {
//      try {
//        const { question } = req.body;
//        if (!question) return res.status(400).json({ error: "Question is required." });
   
//        // 🔹 Step 1: Extract target value (e.g., 10000 revenue)
//        const numberMatch = question.match(/\d+(\.\d+)?/);
//        const targetY = numberMatch ? parseFloat(numberMatch[0]) : null;
//        if (!targetY) return res.status(400).json({ error: "Couldn't find a target value in query." });
   
//        // 🔹 Step 2: Get schema
//        const schema = await getDatabaseSchema();
   
//        // 🔹 Step 3: Generate SQL for correlation (e.g., employees vs revenue)
//        const { sql, x, y } = await generateSQLWithGemini({ question, schema });
//        if (!sql) return res.status(400).json({ error: "Couldn't generate SQL for inverse prediction." });
   
//        // 🔹 Step 4: Run the SQL
//        const rows = await runSelectQuery(sql);
//        if (!rows || rows.length === 0)
//          return res.status(400).json({ error: "No data available for analysis." });
   
//        // 🔹 Step 5: Run inverse prediction logic
//        const result = await inversePrediction(targetY, rows, x || Object.keys(rows[0])[0], y || Object.keys(rows[0])[1]);
   
//        return res.json(result);
//      } catch (error) {
//        console.error("❌ /api/inverse error:", error);
//        return res.status(500).json({ error: "Failed to perform inverse prediction." });
//      }
//    });
   

// app.post("/api/insights", async (req, res) => {
//   try {
//     const { rows, query } = req.body;

//     if (!rows || !Array.isArray(rows) || rows.length === 0) {
//       return res.status(400).json({ error: "No rows provided for insight generation." });
//     }

//     const { analysis, insights } = await analyzeAndGenerateInsights(rows, { query });
//     res.json({ insights, analysis });
//   } catch (err) {
//     console.error("💥 Insight generation failed:", err);
//     res.status(500).json({ error: "Failed to generate insights." });
//   }
// });

// /* ==========================================================
//    🏗️ /api/schema → Quick schema fetch for debugging or UI
//    ========================================================== */
// app.get("/api/schema", async (req, res) => {
//   try {
//     const tables = await getAllTables();
//     const schemas = [];
//     for (const t of tables) {
//       const schema = await getTableSchema(t);
//       schemas.push(schema);
//     }
//     res.json({ tables: schemas });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// /* ==========================================================
//    🚀 Start Server
//    ========================================================== */
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
// ================================
// 🧠 ChatDB – Backend Server (final)
// ================================
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { generatePrediction, inversePrediction } = require("./services/predict");
const { generateSQLWithGemini } = require("./services/gemini");
const {
  getAllTables,
  getTableSchema,
  getDatabaseSchema,
} = require("./services/schema");
const { runSelectQuery, validateSelectSQL } = require("./services/sqlRunner");
const { analyzeAndGenerateInsights } = require("./services/insights");

const app = express();
app.use(cors());
app.use(bodyParser.json());

/* ==========================================================
   🧭 Intent detector helper (simple keyword-based)
   ========================================================== */
function detectIntent(question) {
  if (!question || typeof question !== "string") return "sql";
  const q = question.toLowerCase();

  // Predict / forecast intent
  if (
    q.includes("predict") ||
    q.includes("forecast") ||
    q.includes("future") ||
    q.includes("next")
  ) {
    return "predict";
  }

  // Goal / inverse intent
  if (
    q.includes("if i want") ||
    q.includes("how much") ||
    q.includes("how many") ||
    q.includes("to reach") ||
    q.includes("target") ||
    q.includes("needed")
  ) {
    return "inverse";
  }

  // Insights / analysis
  if (
    q.includes("insight") ||
    q.includes("analyze") ||
    q.includes("trend") ||
    q.includes("pattern") ||
    q.includes("compare")
  ) {
    return "insight";
  }

  // Default — treat as SQL data query
  return "sql";
}

/* ==========================================================
   🧩 Helper: Smart predict from natural question
   - Generates SQL via Gemini, runs it, then predicts
   - Returns { error } or prediction result
   ========================================================== */
async function predictFromQuestion(question) {
  if (!question) return { error: "No question provided." };

  // 1. fetch DB schema
  const schema = await getDatabaseSchema();

  // 2. ask Gemini to produce SQL + x/y suggestions
  const geminiResult = await generateSQLWithGemini({ question, schema });

  if (!geminiResult || !geminiResult.sql) {
    return { error: "Couldn't generate SQL for prediction." };
  }

  const sql = geminiResult.sql;
  if (!validateSelectSQL(sql)) {
    return { error: "Only safe SELECT queries are allowed for prediction." };
  }

  // 3. run SQL
  const rows = await runSelectQuery(sql);
  if (!rows || rows.length === 0) {
    return { error: "No data available for prediction." };
  }

  // 4. choose x/y (fallback to first two columns if Gemini doesn't suggest)
  const xKey = geminiResult.x || Object.keys(rows[0])[0];
  const yKey = geminiResult.y || Object.keys(rows[0])[1];

  // 5. run prediction
  try {
    const result = await generatePrediction(rows, xKey, yKey);
    return result;
  } catch (err) {
    console.error("Prediction engine error:", err);
    return { error: "Prediction failed internally." };
  }
}

/* ==========================================================
   🧩 Helper: Smart inverse (goal-based) from natural question
   - Extracts numeric target from question, builds SQL via Gemini,
     runs it and computes required input using inversePrediction
   ========================================================== */
async function inverseFromQuestion(question) {
  if (!question) return { error: "No question provided." };

  // extract target number from question (first numeric token)
  const numberMatch = question.match(/-?\d+(\.\d+)?/);
  const targetY = numberMatch ? parseFloat(numberMatch[0]) : null;
  if (targetY === null) {
    return { error: "Couldn't find a target numeric value in the question." };
  }

  // schema + generate SQL for relevant columns
  const schema = await getDatabaseSchema();
  const geminiResult = await generateSQLWithGemini({ question, schema });

  if (!geminiResult || !geminiResult.sql) {
    return { error: "Couldn't generate SQL for inverse prediction." };
  }

  const sql = geminiResult.sql;
  if (!validateSelectSQL(sql)) {
    return { error: "Only safe SELECT queries are allowed for inverse prediction." };
  }

  const rows = await runSelectQuery(sql);
  if (!rows || rows.length === 0) {
    return { error: "No data available for analysis." };
  }

  const xKey = geminiResult.x || Object.keys(rows[0])[0];
  const yKey = geminiResult.y || Object.keys(rows[0])[1];

  try {
    const result = await inversePrediction(targetY, rows, xKey, yKey);
    return result;
  } catch (err) {
    console.error("Inverse prediction error:", err);
    return { error: "Inverse prediction failed internally." };
  }
}

/* ==========================================================
   POST /api/ask
   - Detects intent and routes to predict/inverse/insights if needed
   - Otherwise runs Gemini → SQL → execute → return results
   ========================================================== */
app.post("/api/ask", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ error: "No question provided." });
    }

    const intent = detectIntent(question);
    console.log(`🧭 Detected intent: ${intent}`);

    if (intent === "predict") {
      const result = await predictFromQuestion(question);
      if (result.error) return res.status(400).json({ error: result.error });
      return res.json(result);
    }

    if (intent === "inverse") {
      const result = await inverseFromQuestion(question);
      if (result.error) return res.status(400).json({ error: result.error });
      return res.json(result);
    }

    if (intent === "insight") {
      // For insights: use Gemini to produce SQL, run it, then call insights service
      const schema = await getDatabaseSchema();
      const geminiResult = await generateSQLWithGemini({ question, schema });

      if (!geminiResult || !geminiResult.sql) {
        return res.status(400).json({ error: "Couldn't generate SQL for insights." });
      }

      const sql = geminiResult.sql;
      if (!validateSelectSQL(sql)) {
        return res.status(400).json({ error: "Only SELECT queries are allowed." });
      }

      const rows = await runSelectQuery(sql);
      if (!rows || rows.length === 0) {
        return res.status(400).json({ error: "No data available for insights." });
      }

      const { analysis, insights } = await analyzeAndGenerateInsights(rows, { query: question });
      return res.json({ sql, rows, insights, analysis });
    }

    // Default: SQL flow
    const schema = await getDatabaseSchema();
    const geminiResult = await generateSQLWithGemini({ question, schema });

    if (!geminiResult || !geminiResult.sql) {
      return res.status(400).json({ error: "Couldn't generate SQL." });
    }

    const sql = geminiResult.sql;
    if (!validateSelectSQL(sql)) {
      return res.status(400).json({ error: "Only SELECT queries are allowed." });
    }

    // Validate referenced tables exist
    const dbSchema = await getDatabaseSchema();
    const allTables = dbSchema.tables.map((t) => t.name.toLowerCase());
    const sqlLower = sql.toLowerCase();
    const matches = [...sqlLower.matchAll(/\bfrom\s+(\w+)|\bjoin\s+(\w+)/g)];
    const usedTables = matches.map((m) => m[1] || m[2]).filter(Boolean);
    const invalidTables = usedTables.filter((t) => !allTables.includes(t));

    if (invalidTables.length > 0) {
      return res.status(400).json({ error: `Table(s) ${invalidTables.join(", ")} not found in database.` });
    }

    const rows = await runSelectQuery(sql);
    return res.json({
      sql,
      rows: rows || [],
      display: geminiResult.display || "table",
      chartType: geminiResult.chartType || null,
      x: geminiResult.x || null,
      y: geminiResult.y || null,
    });
  } catch (error) {
    console.error("❌ /api/ask error:", error);
    return res.status(500).json({ error: "Server error." });
  }
});

/* ==========================================================
   POST /api/predict
   - Also available as a direct route (same logic as predictFromQuestion)
   ========================================================== */
app.post("/api/predict", async (req, res) => {
  try {
    const { question } = req.body;
    const result = await predictFromQuestion(question);
    if (result.error) return res.status(400).json({ error: result.error });
    return res.json(result);
  } catch (err) {
    console.error("❌ /api/predict error:", err);
    return res.status(500).json({ error: "Failed to generate prediction." });
  }
});

/* ==========================================================
   POST /api/inverse
   - Direct route for inverse predictions (goal-based)
   ========================================================== */
app.post("/api/inverse", async (req, res) => {
  try {
    const { question } = req.body;
    const result = await inverseFromQuestion(question);
    if (result.error) return res.status(400).json({ error: result.error });
    return res.json(result);
  } catch (err) {
    console.error("❌ /api/inverse error:", err);
    return res.status(500).json({ error: "Failed to perform inverse prediction." });
  }
});

/* ==========================================================
   POST /api/insights
   - Accepts rows + query; returns analysis + bullet insights
   ========================================================== */
app.post("/api/insights", async (req, res) => {
  try {
    const { rows, query } = req.body;

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ error: "No rows provided for insight generation." });
    }

    const { analysis, insights } = await analyzeAndGenerateInsights(rows, { query });
    return res.json({ insights, analysis });
  } catch (err) {
    console.error("💥 Insight generation failed:", err);
    return res.status(500).json({ error: "Failed to generate insights." });
  }
});

/* ==========================================================
   GET /api/schema
   - Return all table schemas (helpful for UI debugging)
   ========================================================== */
app.get("/api/schema", async (req, res) => {
  try {
    const tables = await getAllTables();
    const schemas = [];
    for (const t of tables) {
      const schema = await getTableSchema(t);
      schemas.push(schema);
    }
    return res.json({ tables: schemas });
  } catch (err) {
    console.error("❌ /api/schema error:", err);
    return res.status(500).json({ error: err.message });
  }
});

/* ==========================================================
   Start server
   ========================================================== */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
