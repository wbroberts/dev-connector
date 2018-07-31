const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
require('dotenv').config();
require('./db/mongoose');

const app = express();

// Log server requests to console when not testing
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Passport middleware
app.use(passport.initialize());
// Passport config
require('./config/passport')(passport);

// Routes
app.use('/', require('./routes/home'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

module.exports = app;
