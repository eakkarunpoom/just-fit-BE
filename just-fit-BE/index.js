const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const {Activity} = require("./models/Activitity");
const { Goal } = require("./models/Goal");

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.post('/api/activity', async (req, res) => {
    const { activityType, title, dateTime, duration, energyBurn, distance,description } = req.body;
    try {
        const newActivity = new Activity({
            activityType: activityType,
            title: title,
            dateTime: dateTime,
            duration: duration,
            energyBurn: energyBurn,
            distance: distance,
            description: description
        });
        const savedActivity = await newActivity.save();
        console.log('savedActivity: ', savedActivity)
        return res.status(201).json(savedActivity);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
});

app.get("/api/activity", async (req, res) => {
    const data = await Activity.find();
    return res.status(200).json({
        data
    });
});

app.post('/api/goal', async (req, res) => {
    const { activityType, deadline, energyBurn, duration, distance, status} = req.body;
    try {
        const newGoal = new Goal({
            activityType: activityType,
            deadline: deadline,
            energyBurn: energyBurn,
            duration: duration,
            distance: distance,
            status: status
        });
        const savedGoal = await newGoal.save();
        console.log('savedGoal: ', savedGoal)
        return res.status(201).json(savedGoal);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
});


app.get("/api/goal", async (req, res) => {
    const data = await Goal.find(); 
        return res.status(200).json({
        data
    });
});


const start = async () => {
    try {
        const { DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env
        await mongoose.connect(`mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/?retryWrites=true&w=majority`);
        const port = process.env.PORT || 8080;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}.`);
        });
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
};
  
start();