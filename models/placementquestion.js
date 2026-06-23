const mongoose = require("mongoose");


const PlacementQuestionSchema = new mongoose.Schema({
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: "PlacementTopic", required: true },

  question: { type: String, required: true },
  link: { type: String },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
  companyTags: [String], // e.g. ["Amazon", "Microsoft"]
});

const PlacementQuestion = new mongoose.model("PlacementQuestion", PlacementQuestionSchema);
module.exports = PlacementQuestion;
