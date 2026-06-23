const mongoose = require("mongoose");

const PlacementTopicSchema = new mongoose.Schema({
  name: { type: String, required: true },          // e.g. "DSA", "Aptitude", "Array"
  description: { type: String },                   // small intro
  order: { type: Number },                         // sequence
  parentId: {                                      // null → top-level, not null → subtopic
    type: mongoose.Schema.Types.ObjectId,
    ref: "PlacementTopic",
    default: null
  }
});

const PlacementTopic = mongoose.model("PlacementTopic", PlacementTopicSchema);
module.exports = PlacementTopic;
