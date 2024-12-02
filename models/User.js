const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        unique: true
    },last_name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    }, { timestamps: true });// this will add createdAt and updatedAt fields to the schema

module.exports = mongoose.model('User', UserSchema);