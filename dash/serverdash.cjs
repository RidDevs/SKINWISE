const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Initialize SQLite DB
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) return console.error(err.message);
  console.log('Connected to the SQLite database.');
});

// Create table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS skin_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    hydration TEXT NOT NULL,
    texture TEXT NOT NULL,
    redness TEXT NOT NULL,
    acne TEXT NOT NULL,
    notes TEXT
  )
`);

// API to add an entry
app.post('/api/entry', (req, res) => {
  const { date, hydration, texture, redness, acne, notes } = req.body;
  const query = `INSERT INTO skin_entries (date, hydration, texture, redness, acne, notes)
                 VALUES (?, ?, ?, ?, ?, ?)`;
  
  db.run(query, [date, hydration, texture, redness, acne, notes], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Entry added!', id: this.lastID });
  });
});

// API to get all entries
app.get('/api/entries', (req, res) => {
  db.all("SELECT * FROM skin_entries ORDER BY date DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
