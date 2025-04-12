require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;
const cors = require('cors');

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// Create a connection to the database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to the database');
});

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Get all books
app.get('/api/books', (req, res) => {
  db.query('SELECT * FROM books', (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
    } else {
      res.json(results);
    }
  });
});

// Add a new book
app.post('/api/books', (req, res) => {
  const { title, author, status } = req.body;
  const query = 'INSERT INTO books (title, author, status) VALUES (?, ?, ?)';
  db.query(query, [title, author, status], (err, result) => {
    if (err) {
      console.error('Error adding book:', err);
      res.status(500).send('Error adding book');
    } else {
      res.json({ message: 'Book added successfully' });
    }
  });
});

// Update a book
app.put('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, status } = req.body;
  const query = 'UPDATE books SET title = ?, author = ?, status = ? WHERE id = ?';
  db.query(query, [title, author, status, id], (err, result) => {
    if (err) {
      console.error('Error updating book:', err);
      res.status(500).send('Error updating book');
    } else {
      res.json({ message: 'Book updated successfully' });
    }
  });
});

// ❗️DELETE a book
app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM books WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting book:', err);
      res.status(500).send('Error deleting book');
    } else {
      res.json({ message: 'Book deleted successfully' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
