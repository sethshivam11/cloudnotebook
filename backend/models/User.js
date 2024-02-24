const mongoose = require('mongoose');
const { Schema } = require("mongoose");

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    phone:{
        type: Number
    },
    date:{
        type: String,
        default: Date
    },
});
const User = mongoose.model('user', UserSchema);
User.createIndexes();
module.exports = User;