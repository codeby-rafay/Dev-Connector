const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middleware/auth.middleware");
const profileModel = require("../../models/Profile");
const userModel = require("../../models/User");

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const profile = await profileModel
      .findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.status(200).json({ msg: "Profile fetched successfully", profile });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
