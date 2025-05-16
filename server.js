const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./src/dbconfigs/db'); // Your existing DB config

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files (like CSS, JS, HTML)
app.use(express.static(path.join(__dirname, 'public')));

// Default route -> login/signup page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'loginsignup.html'));
});


// ========== ✅ USER LOGIN/SIGNUP SECTION ==========

// Signup route
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    db.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, password],
        (err) => {
            if (err) {
                return res.status(400).json({ message: "Error creating account. Try a different email." });
            }
            res.json({ message: "Signup successful!" });
        }
    );
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password are required!" });
    }

    db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        if (result.length > 0) {
            const user = result[0];
            res.json({ success: true, message: "Login successful!", username: user.username, email: user.email });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials!" });
        }
    });
});


// ========== ✅ SUPPLIERS SECTION ==========

// Add a new supplier
app.post('/suppliers', (req, res) => {
    const { name, email, phone, address, city, state, pincode } = req.body;
    if (!name || !email || !phone || !address || !city || !state || !pincode) {
        return res.status(400).json({ message: "All fields are required" });
    }

    db.query(
        "INSERT INTO supplier (name, email, phone, address, city, state, pincode) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [name, email, phone, address, city, state, pincode],
        (err) => {
            if (err) {
                return res.status(500).json({ message: "Error saving supplier" });
            }
            res.json({ message: "Supplier added successfully!" });
        }
    );
});

// Get all suppliers
app.get('/suppliers', (req, res) => {
    db.query("SELECT * FROM supplier", (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching suppliers" });
        }
        res.json(results);
    });
});

app.get('/brands', (req, res) => {
    db.query('SELECT * FROM brand', (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Error fetching brands' });
        } else {
            res.json(results);
        }
    });
});

// Route to create a new brand
app.post('/brands', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Brand name is required' });
    }

    const query = 'INSERT INTO brand (name) VALUES (?)';
    db.query(query, [name], (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Error creating brand' });
        } else {
            res.json({ success: true, message: 'Brand created successfully' });
        }
    });
});


// Get all UOMs
app.get('/uoms', (req, res) => {
    db.query('SELECT * FROM uom', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching UOMs' });
        res.json(results);
    });
});

// Add new UOM
app.post('/uoms', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'UOM name is required' });

    db.query('INSERT INTO uom (name) VALUES (?)', [name], (err) => {
        if (err) return res.status(500).json({ message: 'Error adding UOM' });
        res.json({ success: true, message: 'UOM added successfully' });
    });
});


// API route to get all categories
app.get('/api/categories', (req, res) => {
    const query = 'SELECT * FROM product_categories ORDER BY id ASC';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// API route to add a new category
app.post('/api/categories', (req, res) => {
    const categoryName = req.body.name;
    const query = 'INSERT INTO product_categories (name) VALUES (?)';
    db.query(query, [categoryName], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true, id: result.insertId });
        }
    });
});

// Get all products
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching products' });
        res.json(results);
    });
});

// Add a new product
app.post('/products', (req, res) => {
    const {
        name, category_id, brand_id, uom_id, gst_percent,
        quantity, cost_per_unit, total_cost
    } = req.body;

    if (!name || !category_id || !brand_id || !uom_id || !gst_percent || !quantity || !cost_per_unit) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const query = `INSERT INTO products 
        (name, category_id, brand_id, uom_id, gst_percent, quantity, cost_per_unit, total_cost)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [name, category_id, brand_id, uom_id, gst_percent, quantity, cost_per_unit, total_cost], (err) => {
        if (err) return res.status(500).json({ message: 'Error adding product' });
        res.json({ success: true, message: 'Product added successfully' });
    });
});
app.get('/supplier/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const [rows] = await db.query("SELECT * FROM suppliers WHERE id = ?", [id]);
      if (rows.length === 0) {
        return res.status(404).json({ message: "Supplier not found" });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
  

// ========== ✅ START SERVER ==========

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
