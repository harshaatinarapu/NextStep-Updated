const express = require("express");
const router = express.Router();
const { wrapAsync } = require("../utils/wrapAsync.js");
const PlacementTopic = require("../models/placementtopic.js");
const PlacementQuestion = require("../models/placementquestion.js");

// Get all top-level topics (e.g. DSA, Aptitude, Core Subjects)
router.get("/topics", wrapAsync(async (req, res) => {
  try {
    const topics = await PlacementTopic.find({ parentId: null }).sort({ order: 1 });
    
    // Add question count and subtopic count to each topic
    const topicsWithCount = await Promise.all(topics.map(async (topic) => {
      // Direct questions under this topic
      const directCount = await PlacementQuestion.countDocuments({ topicId: topic._id });
      
      // Also check subtopic questions if it has child sections
      const subtopics = await PlacementTopic.find({ parentId: topic._id }, '_id');
      const subtopicIds = subtopics.map(s => s._id);
      const subtopicCount = subtopicIds.length > 0 
        ? await PlacementQuestion.countDocuments({ topicId: { $in: subtopicIds } }) 
        : 0;

      return {
        ...topic.toObject(),
        questionCount: directCount + subtopicCount,
        subtopicCount: subtopics.length
      };
    }));
    
    res.json(topicsWithCount); 
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
}));

// For getting subtopics of DSA with question counts
router.get("/topics/dsa", wrapAsync(async (req, res) => {
  try {
    const dsaTopic = await PlacementTopic.findOne({ name: { $regex: /^dsa$/i } });
    if (!dsaTopic) {
      return res.json([]);
    }
    const subtopics = await PlacementTopic.find({ parentId: dsaTopic._id }).sort({ order: 1 });
    const subtopicsWithCount = await Promise.all(subtopics.map(async (sub) => {
      const questionCount = await PlacementQuestion.countDocuments({ topicId: sub._id });
      return {
        ...sub.toObject(),
        questionCount
      };
    }));
    res.json(subtopicsWithCount);
  } catch (error) {
    console.error('Error fetching DSA subtopics:', error);
    res.status(500).json({ error: 'Failed to fetch DSA subtopics' });
  }
}));

// For getting subtopics of Aptitude with question counts
router.get("/topics/aptitude", wrapAsync(async (req, res) => {
  try {
    const aptTopic = await PlacementTopic.findOne({ name: { $regex: /^aptitude$/i } });
    if (!aptTopic) {
      return res.json([]);
    }
    const subtopics = await PlacementTopic.find({ parentId: aptTopic._id }).sort({ order: 1 });
    const subtopicsWithCount = await Promise.all(subtopics.map(async (sub) => {
      const questionCount = await PlacementQuestion.countDocuments({ topicId: sub._id });
      return {
        ...sub.toObject(),
        questionCount
      };
    }));
    res.json(subtopicsWithCount);
  } catch (error) {
    console.error('Error fetching Aptitude subtopics:', error);
    res.status(500).json({ error: 'Failed to fetch Aptitude subtopics' });
  }
}));

// Generic endpoint to get subtopics by parent topic ID
router.get("/subtopics/:parentId", wrapAsync(async (req, res) => {
  try {
    const { parentId } = req.params;
    const subtopics = await PlacementTopic.find({ parentId }).sort({ order: 1 });
    const subtopicsWithCount = await Promise.all(subtopics.map(async (sub) => {
      const questionCount = await PlacementQuestion.countDocuments({ topicId: sub._id });
      return {
        ...sub.toObject(),
        questionCount
      };
    }));
    res.json(subtopicsWithCount);
  } catch (error) {
    console.error('Error fetching subtopics by parent ID:', error);
    res.status(500).json({ error: 'Failed to fetch subtopics' });
  }
}));

// Get questions for a specific topic ID (used by frontend)
router.get("/questions/:topicId", wrapAsync(async (req, res) => {
  try {
    const { topicId } = req.params;
    const questions = await PlacementQuestion.find({ topicId: topicId });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
}));

// Retrieving DSA questions of that subtopic by name or alias
router.get("/topics/dsa/:subtopic", wrapAsync(async (req, res) => {
  try {
    const { subtopic } = req.params;
    const cleanSubtopic = decodeURIComponent(subtopic).trim();
    const escaped = cleanSubtopic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // 1. Exact match
    let topic = await PlacementTopic.findOne({
      name: { $regex: new RegExp(`^${escaped}$`, 'i') }
    });

    // 2. Flexible alias matches
    if (!topic) {
      if (/^array/i.test(cleanSubtopic) || /^string/i.test(cleanSubtopic)) {
        topic = await PlacementTopic.findOne({ name: { $regex: /array/i } });
      } else if (/^two/i.test(cleanSubtopic)) {
        topic = await PlacementTopic.findOne({ name: { $regex: /two\s*pointer/i } });
      } else if (/^sliding/i.test(cleanSubtopic)) {
        topic = await PlacementTopic.findOne({ name: { $regex: /sliding/i } });
      } else if (/^matrix/i.test(cleanSubtopic)) {
        topic = await PlacementTopic.findOne({ name: { $regex: /matrix/i } });
      } else if (/^hash/i.test(cleanSubtopic)) {
        topic = await PlacementTopic.findOne({ name: { $regex: /hashmap/i } });
      } else if (/^interval/i.test(cleanSubtopic)) {
        topic = await PlacementTopic.findOne({ name: { $regex: /interval/i } });
      } else if (/^stack/i.test(cleanSubtopic)) {
        topic = await PlacementTopic.findOne({ name: { $regex: /stack/i } });
      } else if (/^link/i.test(cleanSubtopic)) {
        topic = await PlacementTopic.findOne({ name: { $regex: /linked/i } });
      } else if (/^tree/i.test(cleanSubtopic)) {
        topic = await PlacementTopic.findOne({ name: { $regex: /binary\s*tree\s*general/i } });
      } else if (/^binary\s*search$/i.test(cleanSubtopic)) {
        topic = await PlacementTopic.findOne({ name: "Binary Search" });
      } else if (/^heap/i.test(cleanSubtopic)) {
        topic = await PlacementTopic.findOne({ name: { $regex: /heap/i } });
      } else if (/^bit/i.test(cleanSubtopic)) {
        topic = await PlacementTopic.findOne({ name: { $regex: /bit/i } });
      } else if (/^math/i.test(cleanSubtopic)) {
        topic = await PlacementTopic.findOne({ name: { $regex: /math/i } });
      } else if (/^dp/i.test(cleanSubtopic) || /dynamic/i.test(cleanSubtopic)) {
        topic = await PlacementTopic.findOne({ name: { $regex: /1D DP/i } });
      }
    }
    
    if (!topic) {
      return res.status(404).json({ message: "No subtopic found", subtopic: cleanSubtopic });
    }
    
    const questions = await PlacementQuestion.find({ topicId: topic._id });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching subtopic questions:', error);
    res.status(500).json({ error: 'Failed to fetch subtopic questions' });
  }
}));

// Retrieving Aptitude questions of that subtopic by name or alias
router.get("/topics/aptitude/:subtopic", wrapAsync(async (req, res) => {
  try {
    const { subtopic } = req.params;
    const cleanSubtopic = decodeURIComponent(subtopic).trim();
    const escaped = cleanSubtopic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    let topic = await PlacementTopic.findOne({
      name: { $regex: new RegExp(`^${escaped}$`, 'i') }
    });

    if (!topic) {
      topic = await PlacementTopic.findOne({
        name: { $regex: new RegExp(escaped, 'i') }
      });
    }
    
    if (!topic) {
      return res.status(404).json({ message: "No subtopic found", subtopic: cleanSubtopic });
    }
    
    const questions = await PlacementQuestion.find({ topicId: topic._id });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching aptitude subtopic questions:', error);
    res.status(500).json({ error: 'Failed to fetch aptitude subtopic questions' });
  }
}));

// Add a new question under a topic/subtopic (DSA or Aptitude)
router.post("/questions", wrapAsync(async (req, res) => {
  try {
    const { topicId, question, link, difficulty, companyTags } = req.body;

    if (!topicId) {
      return res.status(400).json({ error: "Topic is required" });
    }
    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question title is required" });
    }

    const topic = await PlacementTopic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ error: "Selected topic not found" });
    }

    let parsedTags = [];
    if (Array.isArray(companyTags)) {
      parsedTags = companyTags.map(t => String(t).trim()).filter(Boolean);
    } else if (typeof companyTags === 'string' && companyTags.trim()) {
      parsedTags = companyTags.split(',').map(t => t.trim()).filter(Boolean);
    }

    const validDiff = ["Easy", "Medium", "Hard"];
    const parsedDiff = validDiff.includes(difficulty) ? difficulty : "Medium";

    const newQuestion = await PlacementQuestion.create({
      topicId: topic._id,
      question: question.trim(),
      link: link ? link.trim() : "",
      difficulty: parsedDiff,
      companyTags: parsedTags
    });

    res.status(201).json({
      message: `Question added successfully to ${topic.name}`,
      question: newQuestion,
      topicName: topic.name
    });
  } catch (error) {
    console.error("Error creating placement question:", error);
    res.status(500).json({ error: error.message || "Failed to add question" });
  }
}));

// Delete a question by ID
router.delete("/questions/:id", wrapAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PlacementQuestion.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Question not found" });
    }
    res.json({ message: "Question deleted successfully", id });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ error: error.message || "Failed to delete question" });
  }
}));

module.exports = router;
