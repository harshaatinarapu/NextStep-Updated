const UserPlacementProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "PlacementQuestion", required: true },
  isCompleted: { type: Boolean, default: false }, // checklist option
  completedAt: { type: Date }
});
const UserPlacementProgress=new mongoose.model("UserPlacementProgress", UserPlacementProgressSchema);
module.exports = UserPlacementProgress;
