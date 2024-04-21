const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

 const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from header if it exists
  //  req.headers.authorization is a string that starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // splits the string after Bearer and returns just the token
      token = req.headers.authorization.split(" ")[1];

      //  verify that the token is valid
      const tokenVerification = jwt.verify(token, process.env.JWT_SECRET_KEY);
      // finds  user by _id from payload of token without password 

      req.user = await User.findById(tokenVerification.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };