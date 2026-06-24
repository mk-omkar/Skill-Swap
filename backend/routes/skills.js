const express = require("express");
const Skill = require("../models/Skill");

const router = express.Router();

// Create Skill
router.post("/create", async (req, res) => {
  try {
    const skill = await Skill.create(req.body);

    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Get All Skills
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find().sort({
      createdAt: -1,
    });

    res.json(skills);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Get Single Skill
router.get("/:id", async (req, res) => {
  try {
    const skill = await Skill.findById(
      req.params.id
    );

    if (!skill) {
      return res.status(404).json({
        error: "Skill not found",
      });
    }

    res.json(skill);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Delete Skill
router.delete("/:id", async (req, res) => {
  try {
    await Skill.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Skill deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;