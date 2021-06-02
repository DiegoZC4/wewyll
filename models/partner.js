const mongoose = require('mongoose');


// Schema
const Schema = mongoose.Schema;
const PartnerSchema = new Schema({
    name: String,
    description: String,
    //image" Image
});

// Model
const Partner = mongoose.model('Partner', PartnerSchema, 'partners');

module.exports =  Partner;