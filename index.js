require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const db = require('./db');

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Use user routes
app.use('/api', userRoutes);

// Use book routes
app.use('/api/books', bookRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
