AI-Powered SQL Query Assistant (Phase 1)

The AI-Powered SQL Query Assistant is a web application that allows users to interact with a database using natural language questions. Instead of writing SQL manually, users can simply type a question in plain English, and the system automatically generates the corresponding SQL query, executes it, and returns the results in a clear, tabular format. Additionally, the generated SQL query is displayed to the user, providing transparency and educational value.

This project focuses on Phase 1 (Core Pipeline) of a multi-phase roadmap, demonstrating the end-to-end flow from Natural Language → SQL → Query Results. The application ensures both usability and safety through several key mechanisms:

Key Features

Natural Language to SQL Conversion

Integrates with Gemini AI to translate user questions into SQL queries.

The AI is prompted to produce only SQL, avoiding unnecessary explanations or extra text.

Safe SQL Execution

Implements a SQL validator to allow only SELECT statements.

Prevents dangerous or destructive operations such as DELETE, DROP, or UPDATE.

Dynamic Schema Introspection

Automatically detects tables and columns from the SQLite database.

Enables the system to work with any database without hardcoding schema details.

Results Presentation

Displays query results in a table for easy readability.

Shows the generated SQL alongside the results for debugging and learning purposes.

Sample Database Integration

Includes a SQLite database with sample datasets like sales, customers, and products.

Demonstrates realistic queries and results for testing and demonstration.

Extensible Architecture

Frontend built with React, backend using Node.js and Express, and database powered by SQLite.

Designed to support future enhancements, including adaptive visualizations (Phase 2) and AI-generated insights (Phase 3).
