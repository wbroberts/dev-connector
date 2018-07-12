const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
require('./db/mongoose');

const app = express();

// Log server requests to console
app.use(morgan('dev'));

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use('/', require('./routes/home'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

module.exports = app;
