const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  // TODO: validation
  // we're going to generate our UUIDs, because they'll be user-facing
  // and MongoDB ObjectIDs expose information about creation time
  _id: String,
  title: String,
  nonprofit: String,
  description: String,
  // location: String,
  // when: String,
  approved: Boolean,
  // image: String,
  // eventMetadata: [
  //   {
  //     _id: String,
  //     response: Schema.Types.Mixed
  //   }
  // ],
  // commonFields: [String],
  // customFields: [
  //   {
  //     _id: String,
  //     label: String,
  //     type: String,
  //     required: Boolean,
  //     suggestedInput: String
  //   }
  // ],
  volunteers: [{type: String}
  //   {
  //     _id: String,
  //     timestamp: Date,
  //     user: String,
  //     fieldData: [{_id: String, response: String}],
  //   }
  ],
});

// Model
const Event = mongoose.model('Event', eventSchema, 'events');

module.exports = Event;
