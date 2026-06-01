// Express backend entry point
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('db/inventory.sqlite', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {    
    console.log('Connected to SQLite database');
  }
});

db.serialize(() => {
  // Create pantry table
  db.run(`CREATE TABLE IF NOT EXISTS pantry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    quantity INTEGER DEFAULT 0,
    price REAL DEFAULT 0.0,
    category TEXT DEFAULT 'Other'
  )`);

  const dummyItems = [
    { name: 'Milk', quantity: 1, price: 2.99, category: 'Dairy' },
    { name: 'Bread', quantity: 2, price: 1.99, category: 'Grain' },
    { name: 'Chicken Breast', quantity: 3, price: 5.99, category: 'Meat' },
    { name: 'Apples', quantity: 5, price: 0.99, category: 'Fruit' },
    { name: 'Carrots', quantity: 4, price: 0.79, category: 'Vegetable' }
  ];
  const stmt = db.prepare("INSERT OR IGNORE INTO pantry (name, quantity, price, category) VALUES (?, ?, ?, ?)");
  dummyItems.forEach(item => { 
    stmt.run(item.name, item.quantity, item.price, item.category);
  });
});


app.use(cors());
app.use(express.json());

app.get('/api/store/items', (req, res) => {
  db.all("SELECT * FROM pantry", (err, rows) => {
    if (err) {
      console.error('Error fetching items', err);
      return res.status(500).json({ error: 'Failed to fetch items' });
    }
    res.json(rows);
  });
});

// Placeholder for pantry inventory
app.get('/api/pantry', (req, res) => {
  res.json([]); // Replace with real data
});

// Placeholder for favorites
app.get('/api/favorites', (req, res) => {
  res.json([]); // Replace with real data
});

// Placeholder for manual price entry
app.post('/api/price', (req, res) => {
  // Accepts { itemId, price }
  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
});
