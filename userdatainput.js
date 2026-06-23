const connectDB = require("./config/db.js");
const mongoose = require("mongoose");
const Branchsub = require("./models/branchsubject.js");
const Branch = require("./models/branch.js");
const User = require("./models/userSchema.js");

connectDB().then(async () => {
    try {

        const data = [
            {
                name: "chsrinivas",
                email: "23311a12a9@it.sreenidhi.edu.in",
                password: "srinivas@it",
                branch: await Branch.findOne({ branchName: "IT" }),
            },
            {
                name: "g sathwik",
                email: "23311a1271@it.sreenidhi.edu.in",
                password: "sathwik@it",
                branch: await Branch.findOne({ branchName: "IT" }),
            },
        ];

        // await User.deleteMany({});
        // const result=await User.insertMany(data);


        for (let user of data) {
            await User.create(user); // will trigger pre('save') hook
        }

        console.log("inserted successfully");



    } catch (err) {
        console.log(err);
    }
});