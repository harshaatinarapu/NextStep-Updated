const express = require("express");

const router = express.Router();

const {wrapAsync}=require("../utils/wrapAsync.js");
const PlacementTopic =require("../models/placementtopic.js");
const PlacementQuestion=require("../models/placementquestion.js");

router.get("/topics",wrapAsync(async (req,res)=>{
    try {
        const topics = await PlacementTopic.find({ parentId: null }).sort({ order: 1 });
        // Add question count to each topic
        const topicsWithCount = await Promise.all(topics.map(async (topic) => {
            const questionCount = await PlacementQuestion.countDocuments({ topicId: topic._id });
            return {
                ...topic.toObject(),
                questionCount
            };
        }));
        res.json(topicsWithCount); 
    } catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({ error: 'Failed to fetch topics' });
    }
}));

//for getting topics of dsa
router.get("/topics/dsa",wrapAsync(async (req,res)=>{
    const subtopics=await PlacementTopic.find({parentId:await PlacementTopic.find({name:"DSA"})}).sort({order:1});
    res.json(subtopics);
}));

// Get questions for a specific topic (used by frontend)
router.get("/questions/:topicId",wrapAsync(async(req,res)=>{
    try {
        const { topicId } = req.params;
        const questions = await PlacementQuestion.find({ topicId: topicId });
        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
}));

//retrieving the questions of that subtopic like arrays, hashmaps and all other sub topics:
router.get("/topics/dsa/:subtopic",wrapAsync(async(req,res)=>{
    const { subtopic } = req.params;
    const topic = await PlacementTopic.findOne({name:subtopic});
    if(!topic){
        return res.status(404).json({message:"no subtopic"});
    }
    // console.log(topic._id);
    
    const questions= await PlacementQuestion.find({ topicId: topic._id });
    res.json(questions);
}));

module.exports=router;



