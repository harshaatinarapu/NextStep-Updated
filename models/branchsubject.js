const mongoose=require("mongoose");

const branchsubSchema=new mongoose.Schema({
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    semester: Number,
});

const Branchsub=new mongoose.model("Branchsub",branchsubSchema);
module.exports=Branchsub;