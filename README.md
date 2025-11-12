🧠 ChatDB – AI-Powered Natural Language Database Assistant

Transform natural language into SQL queries, interactive visualizations, AI-driven insights, and predictive analytics — all in one intelligent data assistant.

🚀 Overview

ChatDB is an AI-powered data assistant that lets users query any database using simple English.
It automatically:

Converts natural language to SQL queries 

Executes them securely on SQLite or MySQL

Displays data as tables or dynamic charts

Generates AI insights on-demand

Supports predictive & goal-based analysis

It’s like having ChatGPT for your databases, with charts, reasoning, and forecasts — all built by Sharan Prasad Eppili 👨‍💻

✨ Features
Feature	Description
💬 Natural Language → SQL	Converts plain English into valid SQL queries
📊 Smart Visualization	Automatically displays results as tables, bar/line/pie charts
🔍 AI Insights	Get trend analysis, correlation findings, and statistical insights
📈 Predictive Analysis	Forecasts future trends using regression models
🎯 Goal-based Analysis	Inverse prediction — find what input is needed to hit a target
🗄️ Multi-Database Support	Works with both SQLite (local) and MySQL (remote)
🌗 Dark/Light Theme	Toggle UI theme dynamically
🧩 Error Handling	Gracefully manages invalid SQL, missing tables, or bad input
🏗️ System Architecture
Frontend (React)
    │
    │  ➡️ Sends natural language queries
    ▼
Backend (Node.js + Express)
    │
    ├── LLM → Generates SQL + chart type
    ├── SQLite/MySQL → Executes validated SQL
    ├── ML Regression → Predicts & forecasts
    ├── Stats Engine → Generates insights
    ▼
Frontend Visualization (Recharts)

⚙️ Tech Stack
🖥️ Frontend

React.js

Recharts (for visualizations)

Axios

CSS3

🧠 Backend

Node.js + Express



SQLite3 (default local DB)

MySQL2 (optional remote DB)

ml-regression-simple-linear (for prediction)

mathjs (for statistics)

dotenv, cors, body-parser

📂 Project Structure
ChatDB/
│
├── backend/
│   ├── server.js                  # Main backend server
│   ├── db/                        # Local SQLite database
│   ├── services/
│   │   ├── gemini.js            
│   │   ├── sqlRunner.js           # SQL execution & validation
│   │   ├── schema.js              # Database schema extractor
│   │   ├── insights.js            # AI-driven insight generation
│   │   ├── predict.js             # Forecast & inverse prediction logic
│   └── .env                      
│
├── frontend/
│   ├── src/
│   │   ├── App.js                 # Main React component
│   │   ├── components/
│   │   │   └── RenderChart.js     # Handles chart rendering & sorting
│   │   ├── App.css                # Styling
│   ├── package.json
│
└── README.md

🧩 Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/<your-username>/ChatDB.git
cd ChatDB

2️⃣ Backend Setup
cd backend
npm install


Create .env file

PORT=4000
GEMINI_API_KEY=your_gemini_api_key_here

# For MySQL (optional)
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_DATABASE=yourdatabase


Start Backend

node server.js


✅ You should see:

✅ Connected to SQLite database
✅ Backend running on port 4000

3️⃣ Frontend Setup
cd ../frontend
npm install
npm start


Frontend runs at 👉 http://localhost:3000

💡 Usage
🔹 Example Queries
User Query	What Happens
“Show total revenue by month”	Generates SQL → Shows bar chart
“List top 5 products by sales”	Displays table view
“Predict next 3 months revenue”	Runs regression → Forecasts trend
“How many employees needed to reach ₹50000 revenue?”	Inverse prediction
“Is there a relation between production and power usage?”	AI detects correlation
“Give insights for this table”	AI explains trends and anomalies
📊 Predictive & Inverse Analysis
Feature	Description
🔮 Predictive Mode	Uses historical numeric data to forecast next N points
🎯 Inverse Mode	Calculates what input is needed to achieve a target output

Example:

Q: "If I want ₹50,000 revenue, how many employees are needed?"
→ 🎯 Required number of employees ≈ 45

🧠 AI Insights Example

For query:
“Show revenue by month”

AI responds:

📊 Average revenue = 3275
📈 Slight negative trend observed (-24.4 per month)
🏆 April had the highest revenue (₹4200)
⚠️ No significant outliers detected

🔐 Security & Validation

Only SELECT queries are allowed

Automatically blocks:

DROP, DELETE, UPDATE, ALTER, etc.

Gemini output is validated before execution

Handles missing or invalid table names gracefully

⚡ Future Enhancements (Phase 3+)

✅ Export to CSV / Excel
✅ Date-based trend forecasting (Prophet model)
✅ Dashboard for saved queries
✅ Voice-based query input
✅ Integration with Google Sheets

🧑‍💻 Author

👤 Sharan Prasad Eppili
🎓 B.Tech Artificial Intelligence & Machine Learning (2022–2026)
🏫 Gokaraju Rangaraju Institute of Engineering & Technology
📍 Telangana, India

💼 Projects:

Genz Attendance (Online Biometric System)

SharanTrendz (E-commerce site clone)

Azure ML Pipeline

ChatDB (This Project 🚀)
