const userModel = require("../models/User");
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
}

module.exports = { authMiddleware };
