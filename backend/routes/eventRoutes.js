const express = require("express");
const router = express.Router();
const { Event, UserProfile } = require("../models");
const auth = require("../middleware/firebaseAuth");
const multer = require("multer");

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: "public/event_images",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

/**
 * GET /event_list_view
 * Returns all events formatted for the dashboard
 */
router.get("/event_list_view", auth, async (req, res) => {
  try {
    const events = await Event.findAll();
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const data = events.map((event) => ({
      id: event.id,
      image: event.image
        ? `${baseUrl}/public/event_images/${event.image}`
        : null,
      host: event.host,
      title: event.title,
      description: event.description,
      event_time: event.event_time,
      event_place: event.event_place,
      estimated_attendees: event.estimated_attendees,
    }));

    res.json(data);
  } catch (err) {
    console.error("Error fetching events:", err.message);
    res.status(500).json({ error: "Server error while loading events." });
  }
});

/**
 * POST /event_list_view
 * Handles new event creation and attendance increment
 */
router.post(
  "/event_list_view",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      const userEmail = req.user.email;
      let user = await UserProfile.findOne({ where: { email: userEmail } });

      // 🛠 Auto-create UserProfile if missing
      if (!user) {
        console.log(`⚡ Creating new UserProfile for ${userEmail}`);
        user = await UserProfile.create({
          email: userEmail,
          profile_name: req.user.name || "Unnamed User",
          xp: 0,
        });
      }

      const {
        event_id,
        increment,
        title,
        description,
        event_time,
        event_place,
        estimated_attendees,
      } = req.body;

      // 🧮 Increment attendance logic
      if (event_id) {
        const event = await Event.findByPk(event_id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        event.estimated_attendees += parseInt(increment || 1);
        await event.save();

        user.xp += 25;
        await user.save();

        return res.json(event);
      }

      // 🎉 Otherwise, create new event
      const image = req.file?.filename;

      const newEvent = await Event.create({
        image,
        title,
        host: user.profile_name,
        description,
        event_time,
        event_place,
        estimated_attendees: parseInt(estimated_attendees || 0),
      });

      user.xp += 50;
      await user.save();

      res.status(201).json(newEvent);
    } catch (err) {
      console.error("Error in POST /event_list_view:", err.message);
      res.status(500).json({ error: "Server error while creating event." });
    }
  }
);

module.exports = router;
