const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema.js');
const router = express.Router();
const dotenv = require("dotenv");
// router.use(express.urlencoded({ extended: true }));

// Add body parser middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));



dotenv.config();


// Helper function to generate token
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

  // Clear any existing cookies first
  res.clearCookie('token');
  
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return token;
};

//Route for Register
router.post("/register",async (req,res)=>{
    try{
        console.log(req.body);
        const {name,email,password,role}=req.body;
        
        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({error:"Name, email, and password are required"});
        }
        
        if(await User.findOne({email:email})){
            return res.status(400).json({error:"user already exists"});
        }

        const user=await User.create({name:name,email:email,password:password,role:role});
        generateToken(res,user._id);
        res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });

    }catch(err){
        console.error('Registration error:', err);
        res.status(500).json({error: "Registration failed. Please try again."});
    }
});


// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    generateToken(res, user._id);
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Log out
router.post("/logout",(req,res)=>{
    res.clearCookie('token');
    res.clearCookie('session');
    res.json({message:"logged out"});
})

// Clear all cookies route
router.post("/clear-cookies",(req,res)=>{
    const cookies = req.headers.cookie;
    if (cookies) {
        cookies.split(';').forEach(cookie => {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            res.clearCookie(name);
        });
    }
    res.json({message:"All cookies cleared"});
})

module.exports=router;