const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema=new mongoose.Schema({
    name:String,
    email:{type:String,unique:true},
    password:String,
    role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
    },
    branch:{type:mongoose.Schema.Types.ObjectId,ref:"Branch"},
    
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User=new mongoose.model("User",userSchema);
module.exports=User;