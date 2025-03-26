// Load dependencies
const path = require('path');
const express = require('express');
const userRoute = require('./routes/user');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
require('dotenv').config(); // Added to load environment variables

// Express instance
const app = express();
const PORT = process.env.PORT || 8000;

// MongoDB connection with error handling
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Middleware
app.use(express.urlencoded({ extended: false })); // Parse form data
app.use(express.json()); // Added to parse JSON requests (optional, depending on use case)
app.use(cookieParser()); // Parse cookies
app.use(checkForAuthenticationCookie('token')); // Custom auth middleware
app.use(express.static(path.join(__dirname, 'public'))); // Added to serve static files (e.g., CSS)

// Home route
app.get('/', (req, res) => {
  res.render('home', {
    user: req.user || null, // Fallback to null if req.user is undefined
  });
});

// User routes
app.use('/user', userRoute);

// // Global error handling middleware (Added)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something went wrong!');
// });

// Start server
app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});