const mongoose = require('mongoose');
const c = require('ansi-colors');

// Variables for database and message
let db;
let dbMessage;

// Set environment
const env = process.env.NODE_ENV || 'development';
// Set the database to use
if (env === 'development') {
  db = process.env.MONGO_URI;
  dbMessage = c.cyan('Development');
} else if (env === 'test') {
  db = process.env.MONGO_URI_TEST;
  dbMessage = c.cyan('Testing');
}

mongoose.Promise = require('bluebird');

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log(`MongoDB connected: ${dbMessage}`))
  .catch(e => console.log(e));

module.exports = mongoose;
