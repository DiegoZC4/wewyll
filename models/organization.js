const mongoose = require('mongoose');


// Schema
const Schema = mongoose.Schema;
const OrganizationSchema = new Schema({
    title: String,
    body: String,
    date: {
        type: String,
        default: Date.now()
    }
});

// Model
const Organization = mongoose.model('Organization', OrganizationSchema, 'organizations');

module.exports =  Organization;