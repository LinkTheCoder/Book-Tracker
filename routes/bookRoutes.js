const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const db = require('../db');

// Protect book routes
router.use(authenticateToken);

// Get all books
router.get('/', (req, res) => {
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
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {
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

// Delete a book
router.delete('/:id', (req, res) => {
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

module.exports = router;
