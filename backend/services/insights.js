// ==========================================
// 💡 Smart Insights v2.0 – ChatDB
// ==========================================
const math = require("mathjs");

// Helper: check if a value is numeric
function isNumeric(val) {
  return !isNaN(parseFloat(val)) && isFinite(val);
}

// Helper: detect if column is time/month/year related
function isTimeColumn(name) {
  const timeKeywords = ["month", "year", "date", "time", "quarter"];
  return timeKeywords.some(k => name.toLowerCase().includes(k));
}

// Helper: compute correlation coefficient
function correlation(arrX, arrY) {
  const n = arrX.length;
  const meanX = math.mean(arrX);
  const meanY = math.mean(arrY);

  const numerator = arrX.map((x, i) => (x - meanX) * (arrY[i] - meanY)).reduce((a, b) => a + b, 0);
  const denominator = Math.sqrt(
    arrX.map(x => Math.pow(x - meanX, 2)).reduce((a, b) => a + b, 0) *
    arrY.map(y => Math.pow(y - meanY, 2)).reduce((a, b) => a + b, 0)
  );

  return denominator === 0 ? 0 : numerator / denominator;
}

// Helper: detect numeric columns
function detectNumericColumns(rows) {
  const sample = rows[0];
  const numericCols = Object.keys(sample).filter(
    col => rows.every(row => isNumeric(row[col]))
  );
  return numericCols;
}

// Helper: detect categorical columns
function detectCategoricalColumns(rows) {
  const sample = rows[0];
  const categoricalCols = Object.keys(sample).filter(
    col => rows.every(row => !isNumeric(row[col]))
  );
  return categoricalCols;
}

// Main function
async function analyzeAndGenerateInsights(rows, { query = "" } = {}) {
  const insights = [];
  const sample = rows[0] || {};

  const numericCols = detectNumericColumns(rows);
  const categoricalCols = detectCategoricalColumns(rows);
  const timeCols = Object.keys(sample).filter(c => isTimeColumn(c));

  // 1️⃣ Basic summary stats
  for (const col of numericCols) {
    const values = rows.map(r => parseFloat(r[col]));
    const mean = math.mean(values);
    const median = math.median(values);
    const min = Math.min(...values);
    const max = Math.max(...values);

    insights.push(
      `📊 Column '${col}' — average: ${mean.toFixed(2)}, median: ${median.toFixed(2)}, min: ${min}, max: ${max}.`
    );

    // Detect outliers
    const q1 = math.quantileSeq(values, 0.25);
    const q3 = math.quantileSeq(values, 0.75);
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    const outliers = values.filter(v => v < lowerBound || v > upperBound);
    if (outliers.length > 0) {
      insights.push(`⚠️ Detected ${outliers.length} outlier(s) in '${col}'.`);
    }
  }

  // 2️⃣ Trend analysis if time column + numeric column
  if (timeCols.length && numericCols.length) {
    const tCol = timeCols[0];
    const nCol = numericCols[0];
    const sorted = [...rows].sort((a, b) => String(a[tCol]).localeCompare(String(b[tCol])));

    const y = sorted.map(r => parseFloat(r[nCol]));
    const x = Array.from({ length: y.length }, (_, i) => i + 1);

    const trend = correlation(x, y);
    if (trend > 0.5) insights.push(`📈 '${nCol}' shows an upward trend over '${tCol}'.`);
    else if (trend < -0.5) insights.push(`📉 '${nCol}' shows a downward trend over '${tCol}'.`);
    else insights.push(`〰️ '${nCol}' shows no clear trend over '${tCol}'.`);
  }

  // 3️⃣ Category analysis
  if (categoricalCols.length && numericCols.length) {
    const cat = categoricalCols[0];
    const num = numericCols[0];

    const totals = {};
    rows.forEach(r => {
      const key = r[cat];
      const val = parseFloat(r[num]);
      totals[key] = (totals[key] || 0) + val;
    });

    const top = Object.entries(totals).sort((a, b) => b[1] - a[1])[0];
    const bottom = Object.entries(totals).sort((a, b) => a[1] - b[1])[0];

    insights.push(`🏆 '${top[0]}' has the highest total ${num} (${top[1].toFixed(2)}).`);
    insights.push(`🔻 '${bottom[0]}' has the lowest total ${num} (${bottom[1].toFixed(2)}).`);
  }

  // 4️⃣ Correlation between numeric columns
  if (numericCols.length >= 2) {
    for (let i = 0; i < numericCols.length; i++) {
      for (let j = i + 1; j < numericCols.length; j++) {
        const col1 = numericCols[i];
        const col2 = numericCols[j];
        const corr = correlation(
          rows.map(r => parseFloat(r[col1])),
          rows.map(r => parseFloat(r[col2]))
        );
        if (Math.abs(corr) >= 0.5) {
          const relation = corr > 0 ? "positive" : "negative";
          insights.push(`🔗 '${col1}' and '${col2}' show a ${relation} correlation (r = ${corr.toFixed(2)}).`);
        }
      }
    }
  }

  // 5️⃣ Add context-aware AI-like summary
  if (insights.length > 0) {
    insights.push("💡 Overall: The dataset reveals key trends and patterns worth exploring further.");
  } else {
    insights.push("ℹ️ No strong patterns detected — dataset might be too small or uniform.");
  }

  // Return structured data
  return {
    analysis: { numericCols, categoricalCols, timeCols },
    insights,
  };
}

module.exports = { analyzeAndGenerateInsights };
