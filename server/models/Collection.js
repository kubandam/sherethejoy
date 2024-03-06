const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: true, unique: true, index: true },
});

const Collection = mongoose.model('Collection', collectionSchema);
module.exports = Collection;
