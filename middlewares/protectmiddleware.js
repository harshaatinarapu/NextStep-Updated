const jwt = require('jsonwebtoken');
const User = require('../models/userSchema.js');

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');
    // console.log("yes verified");
    next();
  } catch {
    res.status(401).json({ error: 'Not authorized' });
  }
};

module.exports = { protect };
