const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const fetchuser = require("../middleware/fetchuser");

// Route 1: Create a user using: POST "/api/auth/createuser". Login required
router.post(
  "/signup",
  [
    body("name", "Enter a valid name").isLength({ min: 2 }),
    body("email", "Enter a valid email").isEmail(),
    body(
      "password",
      "Enter a valid pasword with at least 6 characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors return Bad request and the errors
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ success, error: error.array() });
    }
    try {
      // Check if the user with this email already exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          error: "Sorry a user with this email already exists.",
        });
      }
      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(req.body.password, salt);
      // Create new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success, error: "Internal Server Error." });
    }
  }
);

// Route 2: Authenticate a user using: POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body(
      "password",
      "Enter a valid password with at least 6 characters"
    ).exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials.",
        });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials.",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ success, error: "Internal Server Error." });
    }
  }
);
// Route 3: Get loggedin user details using: POST "/api/auth/getuser". login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal Server Error.");
  }
});

// Route 4: Get Loggedin User credentials using GET "/api/auth/credentials". login required
router.get("/credentials", fetchuser, async (req, res) => {
  try {
    let success = false;
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    user.password = "";
    success = true;
    res.json({success, user});
  } catch (err) {
    console.log(err);
    success = false;
    res.json({ success, error: "Internal Server Error " });
  }
});

// Route 5: Update User Credentials using post "/api/auth/credentials". login required
router.post(
  "/credentials",
  [
    body("name", "Enter a valid name").isLength({ min: 2 }),
    body("email", "Enter a valid email").isEmail(),
    body(
      "password",
      "Enter a valid password with at least 6 characters"
    ).isLength({ min: 6 }),
  ],
  fetchuser,
  async (req, res) => {
    try {
      let success = false;
      const userId = req.user.id;
      const credentials = req.body;
      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(credentials.password, salt);
      credentials.password = secPass;
      const user = await User.findByIdAndUpdate(userId, {$set: credentials}, {new: true});
      success = true;
      res.json({success, user});
    } catch (err) {
      console.log(err);
      success = false;
      res.json({ success, error: err });
    }
  }
);

module.exports = router;
