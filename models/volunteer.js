const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;
const volunteerSchema = new Schema({
  _id: String,
  firstName: String,
  lastName: String,
  zipcode: Number,
  // commonFieldPrefill: [{_id: String, response: String}],
  rsvps: [{type: String}],
})

// Model
const Volunteer = mongoose.model('Volunteer', volunteerSchema, 'volunteers');

module.exports = Volunteer;
