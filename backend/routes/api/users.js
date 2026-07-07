const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const userModel = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters",
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await userModel.findOne({ email: email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new userModel({
        name,
        email,
        avatar,
        password,
      });

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;

      await user.save();

      res.send("User Registered Successfully");
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server error");
    }
    console.log(req.body);
  },
);

module.exports = router;
