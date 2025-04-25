// routes/eventsRoutes.js
const express = require("express");
const router = express.Router();
const { Event, UserProfile } = require("../models");
const auth = require("../middleware/firebaseAuth");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Multer config for event image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/event_images"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

/**
 * GET /events/my-events/
 * List all events created by the current user
 */
router.get("/events/my-events/", auth, async (req, res) => {
  try {
    // Ensure UserProfile exists
    const [profile] = await UserProfile.findOrCreate({
      where: { email: req.user.email },
      defaults: { profile_name: req.user.name || "Unnamed User", xp: 0 }
    });

    const events = await Event.findAll({
      where: { userId: profile.id },
      order: [["event_time", "ASC"]]
    });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const data = events.map(evt => ({
      id: evt.id,
      title: evt.title,
      description: evt.description,
      event_time: evt.event_time,
      event_place: evt.event_place,
      estimated_attendees: evt.estimated_attendees,
      image: evt.image ? `${baseUrl}/public/event_images/${evt.image}` : null
    }));

    res.json(data);
  } catch (err) {
    console.error("Error fetching user events:", err);
    res.status(500).json({ error: "Server error fetching your events." });
  }
});

/**
 * GET /events/:id/
 * Fetch a single event (owned by current user)
 */
router.get("/events/:id/", auth, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Verify ownership
    const profile = await UserProfile.findOne({ where: { email: req.user.email } });
    if (event.userId !== profile.id) return res.status(403).json({ error: "Forbidden" });

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    return res.json({
      id: event.id,
      title: event.title,
      description: event.description,
      event_time: event.event_time,
      event_place: event.event_place,
      estimated_attendees: event.estimated_attendees,
      image: event.image ? `${baseUrl}/public/event_images/${event.image}` : null
    });
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ error: "Server error fetching event." });
  }
});

/**
 * PUT /events/:id/
 * Update an existing event (owned by current user)
 */
router.put(
  "/events/:id/",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event) return res.status(404).json({ error: "Event not found" });

      const profile = await UserProfile.findOne({ where: { email: req.user.email } });
      if (event.userId !== profile.id) return res.status(403).json({ error: "Forbidden" });

      // If new image uploaded, remove old file
      if (req.file && event.image) {
        const oldPath = path.join(__dirname, "..", "public/event_images", event.image);
        fs.unlink(oldPath, err => err && console.warn("Failed to remove old image:", err));
      }

      // Update fields
      const { title, description, event_time, event_place, estimated_attendees } = req.body;
      await event.update({
        title,
        description,
        event_time,
        event_place,
        estimated_attendees,
        ...(req.file && { image: req.file.filename })
      });

      res.json(event);
    } catch (err) {
      console.error("Error updating event:", err);
      res.status(500).json({ error: "Server error updating event." });
    }
  }
);

/**
 * DELETE /events/:id/
 * Remove an event (owned by current user)
 */
router.delete("/events/:id/", auth, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const profile = await UserProfile.findOne({ where: { email: req.user.email } });
    if (event.userId !== profile.id) return res.status(403).json({ error: "Forbidden" });

    // Delete image file if present
    if (event.image) {
      const imgPath = path.join(__dirname, "..", "public/event_images", event.image);
      fs.unlink(imgPath, err => err && console.warn("Failed to remove image on delete:", err));
    }

    await event.destroy();
    res.status(204).end();
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Server error deleting event." });
  }
});

module.exports = router;
