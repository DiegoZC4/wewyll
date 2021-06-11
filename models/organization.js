const mongoose = require('mongoose');


// Schema
const Schema = mongoose.Schema;
const OrganizationSchema = new Schema({
    title: String,
    body: String,
    info: String,
    // img: {
    //     data: Buffer,
    //     contentType: String
    // }
    date: {
        type: String,
        default: Date.now()
    }
});

// Model
const Organization = mongoose.model('Organization', OrganizationSchema, 'organizations');

module.exports =  Organization;