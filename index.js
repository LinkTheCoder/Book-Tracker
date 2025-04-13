require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const app = express();
const port = 3000;
const bookRoutes = require('./routes/bookRoutes');
const db = require('./db'); // Import the database connection

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      res.status(500).send('Error during login');
    } else if (results.length === 0) {
      res.status(401).send('Invalid credentials');
    } else {
      const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    }
  });
});

// Register route
app.post('/api/register', (req, res) => {
  console.log('Register request received:', req.body); // Debug log
  const { username, password } = req.body;
  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error('Error during registration:', err); // Debug log
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(400).send('Username already exists');
      } else {
        res.status(500).send('Error during registration');
      }
    } else {
      res.json({ message: 'User registered successfully' });
    }
  });
});

// Use book routes
app.use('/api/books', bookRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
