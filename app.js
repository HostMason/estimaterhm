const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Connect to SQLite database
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the users database.');
});

// Create users table if not exists
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)`);

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking username' });
        }
        if (row) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ message: 'Error hashing password' });
            }
            
            db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error creating user' });
                }
                res.status(201).json({ message: 'User created successfully' });
            });
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Error finding user' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords' });
            }
            if (result) {
                req.session.userId = user.id;
                res.json({ message: 'Logged in successfully' });
            } else {
                res.status(401).json({ message: 'Invalid username or password' });
            }
        });
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.json({ message: 'Logged out successfully' });
    });
});

app.get('/protected', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json({ message: 'This is a protected route' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
