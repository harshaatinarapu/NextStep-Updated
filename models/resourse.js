const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
  subject: String,
  branch: String,
  sem: Number,
  resourceType: { 
    type: String, 
    enum: ["notes", "previous_paper", "pyq", "video", "book"] 
  },
  title: { type: String, required: true },
  url: { type: String, required: true },
  fileUrl: { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, {
  timestamps: true
});

// Middleware to ensure fileUrl mirrors url if not set
resourceSchema.pre('save', function(next) {
  if (!this.fileUrl && this.url) {
    this.fileUrl = this.url;
  }
  next();
});

module.exports = mongoose.model("Resource", resourceSchema);