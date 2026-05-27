const jwt = require("jsonwebtoken");
const blacklistModul = require("../models/blacklist.model");
const redis = require("../config/cache");

const authUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Token not found , Unauthorized access",
    });
  }

  const isTokenBlackListing = await redis.get("token")

  if (isTokenBlackListing) {
    return res.status(401).json({
      message: "invalid token",
      token,
    });
  }

  let decoded = null;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    res.status(401).json({
      message: "unauthorized access",
      error: error.message,
    });
  }

  req.user = decoded;
  next();
};

module.exports = authUser;
