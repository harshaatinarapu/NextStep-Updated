const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema.js');
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Helper function to generate token
const generateToken = (res, userId) => {
  const secret = process.env.JWT_SECRET || 'nextstep_jwt_secret_dev_key_2026';
  const token = jwt.sign({ userId }, secret, { expiresIn: '7d' });

  // Clear any existing cookies first
  res.clearCookie('token');
  
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return token;
};

// Route for Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }
    
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || 'user'
    });

    const token = generateToken(res, user._id);
    res.status(201).json({ 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role,
      token 
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message || "Registration failed. Please try again." });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(res, user._id);
    res.json({ 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role,
      token 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// Get current user (me)
router.get("/me", async (req, res) => {
  try {
    let token = req.cookies?.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const secret = process.env.JWT_SECRET || 'nextstep_jwt_secret_dev_key_2026';
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(401).json({ error: 'Session expired or invalid' });
  }
});

// Log out
router.post("/logout", (req, res) => {
  res.clearCookie('token');
  res.clearCookie('session');
  res.json({ message: "logged out" });
});

// Clear all cookies route
router.post("/clear-cookies", (req, res) => {
  const cookies = req.headers.cookie;
  if (cookies) {
    cookies.split(';').forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      res.clearCookie(name);
    });
  }
  res.json({ message: "All cookies cleared" });
});

module.exports = router;