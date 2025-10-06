const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const db = new sqlite3.Database("users.db");

app.use(bodyParser.json());
app.use(express.static(__dirname)); // serve HTML/CSS/JS

// Create table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`);

// Register route
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password],
    (err) => {
      if (err) {
        console.error("Error inserting user:", err.message);
        return res.json({ message: "User already exists or error occurred." });
      }
      console.log("User registered:", username);
      res.json({ message: "Registration successful!" });
    }
  );
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt:", username, password);

  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, row) => {
      if (err) {
        console.error("DB error:", err.message);
        return res.json({ message: "Error occurred." });
      }
      if (row) {
        console.log("Login successful for:", username);
        res.json({ message: "Login successful!" });
      } else {
        console.log("Invalid credentials for:", username);
        res.json({ message: "Invalid credentials." });
      }
    }
  );
});

// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
