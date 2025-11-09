const axios = require("axios");

async function generateSQLWithGemini({ question, schema }) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  // ✅ Correct API URL (includes key)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const promp = `
You are a data analyst assistant that converts natural language questions into SQL queries and recommends visualization formats.

Database schema:
${JSON.stringify(schema, null, 2)}

User question: "${question}"

Respond in *valid JSON* format only like this:
{
  "sql": "SELECT ...",
  "display": "table" or "chart",
  "chartType": "bar" or "line" or "pie" or null,
  "x": "column_name or null",
  "y": "column_name or null"
}

Rules:
- Always generate a safe, read-only SELECT query.
- If user mentions 'plot', 'graph', 'trend', or 'chart' → display = "chart".
- Otherwise, display = "table".
- Guess a reasonable chartType (line for time, bar for categories).
- Respond only with JSON, no code blocks.
`;
const prompt = `
You are an intelligent data analyst AI that converts user questions about a SQL database into queries and visualization instructions.

Database schema:
${JSON.stringify(schema, null, 2)}

User question: "${question}"

Generate an answer in **valid JSON** only, with this structure:
{
  "sql": "SELECT ...",
  "display": "table" or "chart",
  "chartType": "bar" or "line" or "pie" or null,
  "x": "column_name or null",
  "y": "column_name or null"
}

Rules:
1. Always return JSON — never use markdown or code blocks.
2. Always include SQL (safe, read-only SELECT).
3. Always include chart suggestions:
   - If user mentions time, trend, or monthly → chartType = "line"
   - If user mentions region, category, or comparison → chartType = "bar"
   - If query aggregates (SUM, AVG, COUNT) → chartType = "bar"
   - Otherwise chartType = "table"
4. Set display = "chart" whenever a chartType is chosen, even if user didn't say 'plot' or 'graph'.
5. Guess x (category/time column) and y (numeric/aggregate column) from SQL.
6. Respond ONLY with JSON — no explanation.
`;


  try {
    const response = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    // Clean up code fences if Gemini wraps JSON in ```json ... ```
    text = text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
      console.log("🧠 Gemini generated SQL:\n", parsed);
    } catch (err) {
      console.error("❌ JSON parsing error:", err.message);
      parsed = {
        sql: "",
        display: "table",
        chartType: null,
        x: null,
        y: null,
      };
    }

    return parsed;
  } catch (error) {
    console.error("❌ Gemini API Error Response:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    throw new Error("Gemini API request failed");
  }
}

module.exports = { generateSQLWithGemini };
