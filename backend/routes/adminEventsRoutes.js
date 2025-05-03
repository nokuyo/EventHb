// routes/events.js
const express = require("express");
const router = express.Router();
const { Event, UserProfile } = require("../models");
const auth = require("../middleware/firebaseAuth");

// GET /events-admin/
router.get("/", auth, async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [{
        model: UserProfile,
        as: "creator",
        attributes: ["id", "profile_name", "email"]
      }]
    });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch events." });
  }
});

// GET /events-admin/:id
router.get("/:id", auth, async (req, res) => {
  try {
    const evt = await Event.findByPk(req.params.id, {
      include: [{ model: UserProfile, as: "creator" }]
    });
    if (!evt) return res.status(404).json({ message: "Not found" });
    res.json(evt);
  } catch (err) {
    res.status(500).json({ message: "Error fetching event." });
  }
});

// PUT /events-admin/:id
router.put("/:id", auth, async (req, res) => {
  try {
    const [updated] = await Event.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating event." });
  }
});

// DELETE /events-admin/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Event.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting event." });
  }
});

module.exports = router;
