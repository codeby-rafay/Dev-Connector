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

    const { text } = req.body;

    try {
      const user = await userModel.findById(req.user.id).select("-password");

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

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await postModel.find().sort({ date: -1 });
    res.status(200).json({ msg: "Posts retrieved successfully", posts });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Private
router.get("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(200).json({ msg: "Post retrieved successfully", post });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Check if the user is the owner of the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await post.deleteOne();

    res.status(200).json({ msg: "Post deleted successfully" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put("/like/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Check if the post has already been liked by this user
    if (post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.status(200).json({ msg: "Post liked successfully", post: post.likes });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put("/unlike/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Check if the post has already been liked by this user
    if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: "Post not liked" });
    }

    post.likes = post.likes.filter(
      (like) => like.user.toString() !== req.user.id,
    );

    await post.save();

    res
      .status(200)
      .json({ msg: "Post unliked successfully", post: post.likes });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// @access  Private
router.post(
  "/comment/:id",
  [authMiddleware, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { text } = req.body;

    try {
      const user = await userModel.findById(req.user.id).select("-password");
      const post = await postModel.findById(id);

      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }
      const newComment = {
        text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);
      await post.save();

      res
        .status(200)
        .json({ msg: "Comment added successfully", post: post.comments });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: "Server Error" });
    }
  },
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete a comment from a post
// @access  Private
router.delete("/comment/:id/:comment_id", authMiddleware, async (req, res) => {
  const { id, comment_id } = req.params;

  try {
    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Pull out comment
    const comment = post.comments.find(
      (comment) => comment.id.toString() === comment_id,
    );

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    post.comments = post.comments.filter(
      ({ id }) => id.toString() !== comment_id,
    );

    await post.save();

    res
      .status(200)
      .json({ msg: "Comment removed successfully", post: post.comments });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
