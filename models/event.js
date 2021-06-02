const mongoose = require('mongoose');


// Schema
const Schema = mongoose.Schema;
const EventSchema = new Schema({
    title: String,
    body: String,
    date: {
        type: String,
        default: Date.now()
    }
});

// Model
const Event = mongoose.model('Event', EventSchema, 'events');

module.exports =  Event;