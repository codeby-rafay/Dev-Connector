const express = require("express");
const request = require("request");
const router = express.Router();
const { authMiddleware } = require("../../middleware/auth.middleware");
const { check, validationResult } = require("express-validator");
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

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
  "/",
  [
    authMiddleware,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await profileModel.findOne({ user: req.user.id });

      if (profile) {
        // Update existing profile
        profile = await profileModel.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true },
        );

        return res
          .status(200)
          .json({ msg: "Profile updated successfully", profile });
      } else {
        // Create new profile
        profile = new profileModel(profileFields);
        await profile.save();
      }

      return res
        .status(200)
        .json({ msg: "Profile updated successfully", profile });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: "Server Error" });
    }
  },
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get("/", async (req, res) => {
  try {
    const profiles = await profileModel
      .find()
      .populate("user", ["name", "avatar"]);
    return res.status(200).json({ profiles });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get("/user/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const profile = await profileModel
      .findOne({ user: user_id })
      .populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }
    return res.status(200).json({ profile });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    return res.status(500).json({ msg: "Server Error" });
  }
});

// @route   DELETE api/profile
// @desc    Delete profile, user and posts
// @access  Private
router.delete("/", authMiddleware, async (req, res) => {
  try {
    //Remove profile
    await profileModel.findOneAndDelete({ user: req.user.id });
    //Remove user
    await userModel.findOneAndDelete({ _id: req.user.id });

    return res.status(200).json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

// @route   PUT api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.put(
  "/experience",
  [
    authMiddleware,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await profileModel.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      return res
        .status(200)
        .json({ msg: "Experience added successfully", profile });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: "Server Error" });
    }
  },
);

// @route   DELETE api/profile/experience
// @desc    Delete experience from profile
// @access  Private
router.delete("/experience/:exp_id", authMiddleware, async (req, res) => {
  try {
    const profile = await profileModel.findOne({ user: req.user.id });

    //Get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    //Easy way to remove experience from profile
    // profile.experience = profile.experience.filter(
    //   (exp) => exp.id !== req.params.exp_id,
    // );

    await profile.save();
    return res
      .status(200)
      .json({ msg: "Experience removed successfully", profile });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

// @route   PUT api/profile/education
// @desc    Add education to profile
// @access  Private
router.put(
  "/education",
  [
    authMiddleware,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldofstudy", "Field of study is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await profileModel.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      return res
        .status(200)
        .json({ msg: "Education added successfully", profile });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: "Server Error" });
    }
  },
);

// @route   DELETE api/profile/education
// @desc    Delete education from profile
// @access  Private
router.delete("/education/:edu_id", authMiddleware, async (req, res) => {
  try {
    const profile = await profileModel.findOne({ user: req.user.id });

    //Easy way to remove education from profile
    profile.education = profile.education.filter(
      (edu) => edu.id !== req.params.edu_id,
    );

    await profile.save();
    return res
      .status(200)
      .json({ msg: "Education removed successfully", profile });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

// @route   GET api/github/:username
// @desc    Get user repos from Github
// @access  Public
router.get("/github/:username", async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&
      client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No Github profile found" });
      }
      return res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
