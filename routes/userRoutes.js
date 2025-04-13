const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

// Login route
router.post('/login', (req, res) => {
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
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error('Error during registration:', err);
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

// Logout route (optional, for client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
