const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;
const organizationSchema = new Schema({
  _id: String,
  name: String,
})

// Model
const Organization = mongoose.model('Organization', organizationSchema, 'organizations');

module.exports = Organization;
