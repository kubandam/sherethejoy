const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  collection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }, // Reference to Collection
});

const User = mongoose.model('User', userSchema);
module.exports = User;
