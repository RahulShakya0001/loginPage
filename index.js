const path = require('path');
const express = require('express');
const userRoute = require('./routes/user');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

// Express Instance 
const app = express();
const PORT = 8000;

mongoose.connect('mongodb://localhost:27017/blogify').then(e => console.log("MonogoDB Connected"));
// Set EJS as the view engine
app.set('view engine', 'ejs');

// Ensure the correct absolute path for the "views" folder
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));

app.get('/', (req, res) => {
    res.render('home', {
        user: req.user,
    }); 

});

app.use('/user', userRoute);

app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`));
