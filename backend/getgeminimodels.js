const axios = require("axios");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

(async () => {
  try {
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`;
    const res = await axios.get(url);
    console.log("✅ Available Gemini Models:\n");
    res.data.models.forEach(m => console.log("•", m.name));
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
  }
})();
