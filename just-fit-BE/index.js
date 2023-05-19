const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const firebaseAdmin = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
require('dotenv').config();
const firebaseSecretConfig = require('./firebase-secret-config.json');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const {Activity} = require("./models/Activitity");
const { Goal } = require("./models/Goal");

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.cert(firebaseSecretConfig)
})

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
})

const appCheckVerification = async (req, res, next) => {
    const appAccessToken = req.header('x-access-token');
    if (!appAccessToken) {
        res.status(401);
        return next('Unauthorized');
    }
    try {
        const decoded = await getAuth()
            .verifyIdToken(appAccessToken)
            .then((decodedToken) => {
                console.log('decodedToken', decodedToken)
                return decodedToken;
            });
        console.log('decoded', decoded)
        req.header['x-user-id'] = decoded.user_id
        req.header['x-user-email'] = decoded.email
        return next();
    } catch (err) {
        console.log('err', err)
        res.status(401);
        return next('Unauthorized..');
    }
}

app.post('/api/activity', [appCheckVerification], async (req, res) => {
    const userId = req.header['x-user-id']; 
    const userEmail = req.header['x-user-email'];

    console.log('userId', userId);
    console.log('userEmail', userEmail)
    
    const { activityType, title, dateTime, duration, energyBurn, distance,description } = req.body;
    try {
        const newActivity = new Activity({
            activityType: activityType,
            title: title,
            dateTime: dateTime,
            duration: duration,
            energyBurn: energyBurn,
            distance: distance,
            description: description,
            userId:userId,
            userEmail:userEmail
        });
        const savedActivity = await newActivity.save();
        console.log('savedActivity: ', savedActivity)
        return res.status(201).json(savedActivity);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
});

app.get("/api/activity", [appCheckVerification], async (req, res) => {
    const userId = req.header['x-user-id']; 
    const userEmail = req.header['x-user-email'];

    console.log('userId', userId);
    console.log('userEmail', userEmail)
    
    const data = await Activity.find({
        userId
    });
    return res.status(200).json({
        data
    });
});

app.put("/api/activity/:id", [appCheckVerification], async (req, res) => {
    const userId = req.header['x-user-id']; 
    const userEmail = req.header['x-user-email'];
    const activityId = req.params.id;

    console.log('userId', userId);
    console.log('userEmail', userEmail)
    
    const { activityType, title, dateTime, duration, energyBurn, distance,description } = req.body;
    try {
        const updatedActivity = await Activity.findOneAndUpdate(
            { _id: activityId, userId: userId },
            {
                activityType: activityType,
                title: title,
                dateTime: dateTime,
                duration: duration,
                energyBurn: energyBurn,
                distance: distance,
                description: description,
                userEmail: userEmail
            },
            { new: true }
        );

        if (!updatedActivity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        console.log('updatedActivity: ', updatedActivity);
        return res.status(200).json(updatedActivity);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

app.delete('/api/activity/:id',[appCheckVerification], async (req, res) => {
    const userId = req.header['x-user-id']; 
    const userEmail = req.header['x-user-email'];
    const activityId = req.params.id;

    console.log('userId', userId);
    console.log('userEmail', userEmail)
    
    const { activityType, title, dateTime, duration, energyBurn, distance,description } = req.body;
    try {
        const deleteActivity = await Activity.findOneAndDelete(
            { _id: activityId, userId: userId },
            {
                activityType: activityType,
                title: title,
                dateTime: dateTime,
                duration: duration,
                energyBurn: energyBurn,
                distance: distance,
                description: description,
                userEmail: userEmail
            },
            { new: true }
        );

        if (!deleteActivity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        console.log('deleteActivity: ', deleteActivity);
        return res.status(200).json(deleteActivity);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

app.post('/api/goal',[appCheckVerification], async (req, res) => {
    const userId = req.header['x-user-id']; 
    const userEmail = req.header['x-user-email'];

    console.log('userId', userId);
    console.log('userEmail', userEmail)
    
    const { activityType, deadline, energyBurn, duration, distance, status } = req.body;
    try {
        const newGoal = new Goal({
            userId : userId,
            userEmail : userEmail,
            activityType: activityType,
            deadline: deadline,
            energyBurn: energyBurn,
            duration: duration,
            distance: distance,
            status: status,
            userId: userId,
            userEmail: userEmail
        });
        const savedGoal = await newGoal.save();
        console.log('savedGoal: ', savedGoal)
        return res.status(201).json(savedGoal);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
});


app.get("/api/goal",[appCheckVerification], async (req, res) => {
    const userId = req.header['x-user-id']; 
    const userEmail = req.header['x-user-email'];

    console.log('userId', userId);
    console.log('userEmail', userEmail)
    
    const data = await Goal.find({
        userId
    }); 
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