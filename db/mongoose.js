const mongoose = require('mongoose');

const db = process.env.MONGO_URI;

mongoose.Promise = require('bluebird');

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB connected'))
  .catch(e => console.log(e));

module.exports = mongoose;
