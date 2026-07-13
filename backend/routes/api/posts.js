const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { authMiddleware } = require("../../middleware/auth.middleware");
const postModel = require("../../models/post.model");
const userModel = require("../../models/user.model");
const profileModel = require("../../models/profile.model");

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  "/",
  [authMiddleware, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await userModel.findById(req.user.id).select("-password");
    const { text } = req.body;

    try {
      const newPost = new postModel({
        text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();

      res.status(200).json({ msg: "Post created successfully", post });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
    }
  },
);

module.exports = router;
