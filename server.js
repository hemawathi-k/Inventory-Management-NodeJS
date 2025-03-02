const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

const db = require('./src/dbconfigs/db'); // Ensure this path is correct

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve loginsignup.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'loginsignup.html'));
});

const saltRounds = 10; // Number of rounds for password hashing

// Signup API
app.post('/signup', async (req, res) => {
    console.log("Signup Request Body:", req.body); // Debugging

    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", 
            [username, email, hashedPassword], 
            (err, result) => {
                if (err) {
                    console.error("Database Error:", err);
                    return res.status(400).json({ message: "Error creating account. Try a different email." });
                }
                res.json({ message: "Signup successful!" });
            }
        );
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Login API
app.post('/login', (req, res) => {
    console.log("Login Request Body:", req.body); // Debugging

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password are required!" });
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        if (result.length > 0) {
            const user = result[0];
            try {
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (passwordMatch) {
                    res.json({ success: true, message: "Login successful!", username: user.username, email: user.email });
                } else {
                    res.status(401).json({ success: false, message: "Invalid credentials!" });
                }
            } catch (error) {
                console.error("Error Verifying Password:", error);
                res.status(500).json({ message: "Error verifying credentials" });
            }
        } else {
            res.status(401).json({ success: false, message: "User not found!" });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
