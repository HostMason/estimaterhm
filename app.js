const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Serve static files
app.use(express.static('public'));

// Connect to PostgreSQL database
const pool = new Pool({
    user: 'your_username',
    host: 'localhost',
    database: 'your_database',
    password: 'your_password',
    port: 5432,
});

// Create users table if not exists
pool.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`, (err, res) => {
    if (err) {
        console.error('Error creating users table:', err);
    } else {
        console.log('Users table created or already exists');
    }
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve page content
app.get('/:page', (req, res) => {
    const page = req.params.page;
    const validPages = ['dashboard', 'form-builder', 'forms', 'submissions', 'settings'];
    
    if (validPages.includes(page)) {
        res.sendFile(path.join(__dirname, 'views', `${page}.html`));
    } else {
        res.status(404).send('Page not found');
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        
        const hash = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hash]);
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating user' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            req.session.userId = user.id;
            res.json({ message: 'Logged in successfully' });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error logging in' });
    }
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
