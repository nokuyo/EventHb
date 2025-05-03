const express = require("express");
const router = express.Router();
const { UserProfile } = require("../models");
const auth = require("../middleware/firebaseAuth");

// GET all users (admin view)
router.get("/", auth, async (req, res) => {
  const users = await UserProfile.findAll();
  res.json(users);
});

// DELETE 
router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedCount = await UserProfile.destroy({
      where: { id: req.params.id }
    });
    if (!deletedCount) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
});


module.exports = router;
