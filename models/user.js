const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userDataSchema = new Schema({
  _id: String,
  volunteer: String,
  nonProfit: String,
  business: String,
  admin: Boolean,
});

const UserData = mongoose.model('UserData', userDataSchema, 'users');

module.exports = UserData;
