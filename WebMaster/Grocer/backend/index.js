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
    category TEXT DEFAULT 'Other',
    favorite BOOLEAN DEFAULT 0
  )`);

  const dummyItems = [
    { name: 'Milk', quantity: 1, price: 2.99, category: 'Dairy', favorite: 0 },
    { name: 'Bread', quantity: 2, price: 1.99, category: 'Grain', favorite: 0 },
    { name: 'Chicken Breast', quantity: 3, price: 5.99, category: 'Meat', favorite: 0 },
    { name: 'Apples', quantity: 5, price: 0.99, category: 'Fruit', favorite: 0 },
    { name: 'Carrots', quantity: 4, price: 0.79, category: 'Vegetable', favorite: 0 }
  ];
  const stmt = db.prepare("INSERT OR IGNORE INTO pantry (name, quantity, price, category, favorite) VALUES (?, ?, ?, ?, ?)");
  dummyItems.forEach(item => { 
    stmt.run(item.name, item.quantity, item.price, item.category, item.favorite);
  });

  db.run("ALTER TABLE pantry ADD COLUMN favorite BOOLEAN DEFAULT 0", err => {
    if (err && !/duplicate column name/.test(err.message.toLowerCase())) {
      console.error('Error ensuring favorite column exists:', err);
    }
  });
});


app.use(cors());
app.use(express.json());

app.get('/api/store/items', (req, res) => {
  db.all("SELECT id, name, quantity, price, category, COALESCE(favorite, 0) AS favorite FROM pantry", (err, rows) => {
    if (err) {
      console.error('Error fetching items', err);
      return res.status(500).json({ error: 'Failed to fetch items' });
    }
    res.json(rows);
  });
});

app.post('/api/store/items/:id/favorite', (req, res) => {
  const itemId = req.params.id;
  const { favorite } = req.body || {};

  if (typeof favorite !== 'boolean') {
    return res.status(400).json({ error: 'Missing or invalid favorite value' });
  }

  db.run("UPDATE pantry SET favorite = ? WHERE id = ?", [favorite ? 1 : 0, itemId], function(err) {
    if (err) {
      console.error('Error updating favorite status', err);
      return res.status(500).json({ error: 'Failed to update favorite status' });
    }
    res.json({ success: true, favorite });
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
});
