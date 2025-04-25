// routes/userProfile.js
const express = require("express");
const router = express.Router();
const { UserProfile, Event } = require("../models");
const auth = require("../middleware/firebaseAuth");

/**
 * GET /user-profile
 * Returns the signed-in user's profile along with their events
 */
router.get("/user-profile", auth, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      where: { email: req.user.email },
      include: [{ model: Event, as: "events", order: [["event_time", "ASC"]] }]
    });

    if (!profile) return res.status(404).json({ error: "User not found" });

    res.json({
      id: profile.id,
      email: profile.email,
      profile_name: profile.profile_name,
      xp: profile.xp,
      level: Math.floor(profile.xp / 500),
      events: profile.events,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
