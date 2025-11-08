const axios = require("axios");

async function generateSQLWithGemini({ question, schema }) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  // ✅ Updated endpoint
  //gemini 2.5 pro
  //const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`;
//gemini flash
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const prompt = `
You are a SQL expert and must write **only one valid SQL SELECT query**.
Never include INSERT, UPDATE, DELETE, DROP, CREATE, ALTER, PRAGMA or any comments.

Database schema:
${JSON.stringify(schema, null, 2)}

User question: "${question}"

Rules:
- Return only the SQL SELECT statement (no markdown, quotes, explanations, JSON, or comments).
- If aggregation or grouping is needed, use GROUP BY.
- If filtering is needed, use WHERE.
- Do not change column or table names.
- Output must begin with SELECT.

Return only that SQL line.
`;


  try {
    const response = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const text =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    return text;
  } catch (err) {
    if (err.response) {
      console.error("🔴 Gemini API Error Response:");
      console.error("Status:", err.response.status);
      console.error("Data:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error("🔴 Gemini API Error:", err.message);
    }
    throw new Error("Gemini API request failed");
  }
}

module.exports = { generateSQLWithGemini };
