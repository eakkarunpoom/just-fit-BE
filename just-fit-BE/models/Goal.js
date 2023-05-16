const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
    activityType : {
        type: String,
        required: true
    },
    deadline : {
        type: Date,
        required: true
    },
    energyBurn : {
        type: Number,
        required: false
    },
    duration : {
        type: Number,
        required: true
    },
    distance : {
        type: Number,
        required: false
    },
    status : {
        type: String,
        required: false
    }
})

const Goal = mongoose.model('Create_Goal', GoalSchema);

module.exports = { Goal }