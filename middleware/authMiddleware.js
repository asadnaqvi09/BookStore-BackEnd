const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const protectedRoute = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if(req.user && req.user.role === 'admin'){
        next();
      } else {
        res.status(403);
        throw new Error("User not authorized as admin");
      }
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("User not authorized,Token Failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protectedRoute };