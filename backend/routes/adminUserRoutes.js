const express = require("express");
const router = express.Router();
const { UserProfile } = require("../models");
const auth = require("../middleware/firebaseAuth");

// GET all users (admin view)
router.get("/", auth, async (req, res) => {
  const users = await UserProfile.findAll();
  res.json(users);
});

module.exports = router;
