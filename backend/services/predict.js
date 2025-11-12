const ml = require("ml-regression-simple-linear");

/**
 * 🧠 Generate predictions using simple linear regression.
 * rows: array of { x, y }
 * xKey, yKey: column names (like 'month', 'revenue')
 */
async function generatePrediction(rows, xKey, yKey) {
  try {
    if (!rows || rows.length < 2)
      return { message: "Not enough data for prediction", predictions: [] };

    // 🔹 Extract x and y values
    let x = rows.map((r, i) => i + 1); // use index if x isn't numeric
    let y = rows.map((r) => parseFloat(r[yKey]) || 0);

    // 🔹 Train regression model
    const regression = new ml.SimpleLinearRegression(x, y);

    // 🔹 Predict next 3 future points
    const lastIndex = x.length;
    const futurePredictions = [];
    const numPredictions = 3;

    for (let i = 1; i <= numPredictions; i++) {
      const futureX = lastIndex + i;
      const predictedY = regression.predict(futureX);
      futurePredictions.push({
        x: `Next ${i}`,
        y: parseFloat(predictedY.toFixed(2)),
      });
    }

    return {
      message: "📈 Forecast generated successfully.",
      predictions: futurePredictions,
      coefficients: {
        slope: regression.slope.toFixed(3),
        intercept: regression.intercept.toFixed(3),
      },
    };
  } catch (err) {
    console.error("Prediction error:", err);
    return { message: "Prediction failed", predictions: [] };
  }
}

/**
 * 🎯 Inverse prediction – find required X for target Y
 */
async function inversePrediction(targetY, rows, xKey, yKey) {
  try {
    if (!rows || rows.length < 2)
      return { message: "Not enough data for inverse analysis" };

    let x = rows.map((r, i) => i + 1);
    let y = rows.map((r) => parseFloat(r[yKey]) || 0);

    const regression = new ml.SimpleLinearRegression(x, y);

    const requiredX = (targetY - regression.intercept) / regression.slope;

    return {
      message: "🎯 Goal-based calculation successful",
      inverseResult: {
        requiredX,
        xLabel: xKey,
        slope: regression.slope,
        intercept: regression.intercept,
      },
    };
  } catch (err) {
    console.error("Inverse prediction error:", err);
    return { message: "Inverse prediction failed" };
  }
}

module.exports = { generatePrediction, inversePrediction };
