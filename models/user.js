const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userDataSchema = new Schema({
  _id: String,
  volunteer: String,
  nonprofit: String,
  nonprofitApproved: Boolean,
  business: String,
  businessApproved: Boolean,
  admin: Boolean,
});

const UserData = mongoose.model('UserData', userDataSchema, 'users');

module.exports = UserData;
