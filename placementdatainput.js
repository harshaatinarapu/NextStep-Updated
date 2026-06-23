const Subject=require("./models/subject.js");
const connectDB = require("./config/db.js");
const mongoose = require("mongoose");
const PlacementTopic = require("./models/placementtopic.js");
const PlacementQuestion = require("./models/placementquestion.js");

connectDB().then(async ()=>{
    try{

        // const data=[
            //main topics 
            // {
            //     name:"Aptitude",
            //     description:"This is the first round in most of the companies",
            //     order:1,
            // },
            // {
            //     name:"DSA",
            //     order:2,
            // },


            //sub topics in dsa and aptitude
            //sub topics in dsa : 

        //     {
        //         name:"Arrays",
        //         order:1,
        //         parentId:await PlacementTopic.findOne({name:"DSA"}),
        //     },
        //     {
        //         name:"Strings",
        //         order:2,
        //         parentId:await PlacementTopic.findOne({name:"DSA"}),
        //     },
        //     {
        //         name:"Hashmapsandsets",
        //         order:3,
        //         parentId:await PlacementTopic.findOne({name:"DSA"}),
        //     },
        //     {
        //         name:"Twopointer",
        //         order:4,
        //         parentId:await PlacementTopic.findOne({name:"DSA"}),
        //     },
        //     {
        //         name:"Stacks",
        //         order:5,
        //         parentId:await PlacementTopic.findOne({name:"DSA"}),
        //     },

        // ];

        const placementquesData = [
            {
                topicId:await PlacementTopic.findOne({ name: "Arrays" }, "_id"),

                question:"Find Closest Number to Zero",
                link:"https://leetcode.com/problems/find-closest-number-to-zero/description/",
                difficulty:"Easy",
            },
            {
                topicId:await PlacementTopic.findOne({ name: "Arrays" }, "_id"),
                question:"Merge Strings Alternately",
                link:"https://leetcode.com/problems/merge-strings-alternately/description/",
                difficulty:"Easy",
            },


            {
                topicId:await PlacementTopic.findOne({ name: "Strings" }, "_id"),

                question:"Longest Common Prefix",
                link:"https://leetcode.com/problems/find-closest-number-to-zero/description/",
                difficulty:"Easy",
            },



            {
                topicId:await PlacementTopic.findOne({ name: "Hashmapsandsets" }, "_id"),
                question:"Jewels and Stones",
                link:"https://leetcode.com/problems/jewels-and-stones/description/",
                difficulty:"Easy",
            },
            {
                topicId:await PlacementTopic.findOne({ name: "Hashmapsandsets" }, "_id"),
                question:"Contains Duplicate",
                link:"https://leetcode.com/problems/contains-duplicate/description/",
                difficulty:"Easy",
            },



            {
                topicId:await PlacementTopic.findOne({ name: "Twopointer" }, "_id"),
                question:"Two Sum II - Input Array Is Sorted",
                link:"https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/description/",
                difficulty:"Medium",
            },
            {
                topicId:await PlacementTopic.findOne({ name: "Twopointer" }, "_id"),
                question:"Squares of a Sorted Array",
                link:"https://leetcode.com/problems/squares-of-a-sorted-array/description/",
                difficulty:"Easy",
            },


            {
                topicId:await PlacementTopic.findOne({ name: "Stacks" }, "_id"),
                question:"Baseball Game",
                link:"https://leetcode.com/problems/baseball-game/description/",
                difficulty:"Easy",
            },
            {
                topicId:await PlacementTopic.findOne({ name: "Stacks" }, "_id"),
                question:"Evaluate Reverse Polish Notation (RPN)",
                link:"https://leetcode.com/problems/evaluate-reverse-polish-notation/description/",
                difficulty:"Medium",
            },

        ];

        // const result = await PlacementTopic.insertMany(data);
        const result = await PlacementQuestion.insertMany(placementquesData);
        console.log("successfully inserted");
        process.exit();


    }catch(err){
        console.log(err);
    }
});