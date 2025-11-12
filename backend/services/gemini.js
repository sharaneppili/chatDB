const axios = require("axios");

async function generateSQLWithGemini({ question, schema }) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  // ✅ Correct Gemini endpoint
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  // ✅ Your original high-quality prompt (kept as is)
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
4. Only use tables listed in the schema above.
   - If the user mentions a table not in the schema, respond with exactly this text: "TABLE_NOT_FOUND".
5. Never guess or assume a table name.
6. Never include INSERT, UPDATE, DELETE, DROP, ALTER, or CREATE commands.
7. Return ONLY a valid SQL SELECT query — no explanations or text.
8. Set display = "chart" whenever a chartType is chosen, even if user didn’t say 'plot' or 'graph'.
9. Guess x (category/time column) and y (numeric/aggregate column) from SQL.
10. Respond ONLY with JSON — no explanation.
`;

  try {
    const response = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    let text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    // Clean up markdown code fences if present
    text = text.replace(/```json|```/g, "").trim();

    // 🚨 Check for explicit "TABLE_NOT_FOUND"
    if (text.includes("TABLE_NOT_FOUND")) {
      console.warn("❌ Gemini reported: Table not found.");
      return { error: "Table not found in database." };
    }

    // 🚨 Check for disallowed commands
    if (/insert|update|delete|drop|alter|create/i.test(text)) {
      console.warn("❌ Unsafe SQL keyword detected.");
      return { error: "Only SELECT queries are allowed." };
    }

    // ✅ Safe JSON parse
    try {
      const parsed = JSON.parse(text);
      console.log("🧠 Gemini generated SQL:\n", parsed);
      return parsed;
    } catch (err) {
      console.error("❌ JSON parsing error:", err.message);
      console.warn("⚠️ Gemini raw output:", text);
      return { error: "Gemini did not return valid SQL JSON." };
    }
  } catch (error) {
    console.error("❌ Gemini API Error Response:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
    return { error: "Gemini API request failed." };
  }
}

module.exports = { generateSQLWithGemini };
