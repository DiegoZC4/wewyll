const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;
const volunteerSchema = new Schema({
  id: String,
  name: String,
  commonFieldPrefill: [{_id: String, response: String}],
})

// Model
const Volunteer = mongoose.model('Volunteer', volunteerSchema, 'volunteers');

module.exports = Volunteer;
