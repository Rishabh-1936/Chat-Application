const mongoose = require('mongoose');

var user = new mongoose.Schema({
    userName: String,
    email: String,
    password: String
});

var userSchema = mongoose.model('userSchema', user);

module.exports = userSchema;