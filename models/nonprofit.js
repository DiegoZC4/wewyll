const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;
const nonprofitSchema = new Schema({
  _id: String,
  name: String,
  description: String,
  members: Number,
  visible: Boolean,
});

// Model
module.exports = mongoose.model('Nonprofit', nonprofitSchema, 'nonprofits');