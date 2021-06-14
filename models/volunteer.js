const mongoose = require('mongoose');


// Schema
const Schema = mongoose.Schema;
const VolunteerSchema = new Schema({
    title: String,
    body: String,
    name: String,
    email: String,
    age: String,
    volunteertype: String,
    interests: String,
    zipcode: String,
    transportation: String,
    gender: String,
    languages: String,
    previousExperience: String,
    resume: String,
    date: {
        type: String,
        default: Date.now()
    }
});

// Model
const Volunteer = mongoose.model('Volunteer', VolunteerSchema, 'volunteers');

module.exports = Volunteer;