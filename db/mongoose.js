const mongoose = require('mongoose');

const db = process.env.MONGO_URI;

mongoose
  .connect(db)
  .then(() => console.log('MongoDB connected'))
  .catch(e => console.log(e));

mongoose.Promise = global.Promise;

module.exports = mongoose;
