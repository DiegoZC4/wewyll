const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  // TODO: validation
  // we're going to generate our UUIDs, because they'll be user-facing
  // and MongoDB ObjectIDs expose information about creation time
  _id: String,
  title: String,
  organization: String,
  description: String,
  location: String,
  time: String,
  approved: Boolean,
  image: String,
  commonFields: [String],
  customFields: [
    {
      id: String,
      label: String,
      type: String,
      required: Boolean,
      suggestedInput: String
    }
  ],
  signUps: [
    {
      id: String,
      timestamp: Date,
      user: String,
      fieldData: [{field: String, response: String}],
    }
  ],
});

// Model
const Event = mongoose.model('Event', eventSchema, 'events');

module.exports = Event;
