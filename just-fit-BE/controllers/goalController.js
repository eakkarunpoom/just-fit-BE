const { Goal } = require("../models/Goal");

// POST (Create) - Create a new goal.
exports.createGoal = async (req, res) => {
    const userId = req.headers['x-user-id'];
    console.log('userId', userId);
    const { activityType, deadline, energyBurn, duration, distance, status } = req.body;
    try {
        const newGoal = new Goal({
            userId: userId,
            activityType: activityType,
            deadline: deadline,
            energyBurn: energyBurn,
            duration: duration,
            distance: distance,
            status: status,
        });
        const savedGoal = await newGoal.save();
        console.log('savedGoal: ', savedGoal)
        return res.status(201).json(savedGoal);
    } catch (error) {
        // return res.status(404).json({ message: error.message });
        console.log(error);
    }
};

exports.getGoal = async (req, res) => {
    const userId = req.headers['x-user-id'];
    console.log('userId', userId);
    const data = await Goal.find({ userId });
    console.log("get goal : ", data);
    return res.status(200).json({ data });
}

exports.updateStatusGoal = async (req, res) => {
    const userId = req.headers['x-user-id'];
    const { id: goalId } = req.params;
    const { status } = req.body;
    console.log(status, goalId);
    const goalUpdated = await Goal.findOneAndUpdate({ _id: goalId, userId }, { $set: { status: status } }, { new: true })
    console.log("Update status success.", goalUpdated);
    res.send(goalUpdated);
}

// app.post('/api/goal', [appCheckVerification], async (req, res) => {
//     const userId = req.header['x-user-id'];
//     console.log('userId', userId);

//     const { activityType, deadline, energyBurn, duration, distance, status } = req.body;
//     try {
//         const newGoal = new Goal({
//             userId: userId,
//             activityType: activityType,
//             deadline: deadline,
//             energyBurn: energyBurn,
//             duration: duration,
//             distance: distance,
//             status: status,
//             userId: userId,
//         });
//         const savedGoal = await newGoal.save();
//         console.log('savedGoal: ', savedGoal)
//         return res.status(201).json(savedGoal);
//     } catch (error) {
//         return res.status(404).json({ message: error.message });
//     }
// });



// GET - get all goal
// app.get("/api/goal", [appCheckVerification], async (req, res) => {
//     const userId = req.header['x-user-id'];
//     console.log('userId', userId);

//     const data = await Goal.find({
//         userId
//     });
//     return res.status(200).json({
//         data
//     });
// });


// app.get("/status", (req, res) => {
//     console.log(req.headers.host);
//     res.send("<h1><It's Ok!</h1>")
// })