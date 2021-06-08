const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;

const commonFieldSchema = new Schema({
  _id: String,
  label: String,
  type: String,
  required: Boolean,
  suggestedInput: String
});

const CommonField = mongoose.model('CommonField', commonFieldSchema, 'commonFields');

module.exports = CommonField;
