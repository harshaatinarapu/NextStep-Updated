const mongoose=require("mongoose");

const subjectSchema=new mongoose.Schema({
    subjectName: { type: String, required: true },
    subjectCode: String,
});

const Subject=new mongoose.model("Subject",subjectSchema);
module.exports=Subject;