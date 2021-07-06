const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;

const eventTagSchema = new Schema({
  _id: String,
  label: String,
  dataType: {
    type: String,
    enum: ['string', 'datetime', 'int', 'float']
  },
});

// Model
const EventMeta = mongoose.model('EventMetadata', eventTagSchema, 'eventMetadata');

module.exports = EventMeta;
