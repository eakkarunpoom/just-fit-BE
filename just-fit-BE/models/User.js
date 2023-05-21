const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name : {
        type: String,
        required: false
    },
    gender : {
        type: String,
        required: false
    },
    age : {
        type: Number,
        required: false
    },
    height : {
        type: Number,
        required: false
    },
    weight : {
        type: Number,
        required: false
    },

    userId : {
        type: String,
        required: true
    },
})

const User = mongoose.model('Create_User', UserSchema);
module.exports = { User }