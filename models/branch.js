const mongoose = require("mongoose");

const branchSchema=new mongoose.Schema({
    branchName:{type:String,required:true},
});

const Branch=new mongoose.model("Branch",branchSchema);
module.exports = Branch;