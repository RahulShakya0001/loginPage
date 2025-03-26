// Load dependencies
const path = require('path');
const express = require('express');
const userRoute = require('./routes/user');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
require('dotenv').config(); // Load environment variables

// Express instance
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware setup
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Home route
app.get('/', (req, res) => {
  res.render('home', {
    user: req.user || null,
  });
});

// User routes
app.use('/user', userRoute);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// MongoDB connection with error handling
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // 5 sec timeout
    socketTimeoutMS: 45000, // Longer timeout
  })
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    
    // Start server only if MongoDB is connected
    app.listen(PORT, () => {
      console.log(`🚀 Server started at PORT: ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1); // Exit process if MongoDB fails
  });
