const express = require("express");
const router = express.Router();
const { UserProfile } = require("../models");
const auth = require("../middleware/firebaseAuth");

// GET /user-profile
router.get("/user-profile", auth, async (req, res) => {
  try {
    const user = await UserProfile.findOne({
      where: { email: req.user.email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      id: user.id,
      email: user.email,
      profile_name: user.profile_name,
      xp: user.xp,
      level: Math.floor(user.xp / 500),
    });
  } catch (err) {
    console.error("Error fetching user profile:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
