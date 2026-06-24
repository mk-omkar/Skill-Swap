const express = require("express");
const Booking = require("../models/Booking");
const Skill = require("../models/Skill");
const router = express.Router();

// Create Booking
router.post("/create", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Get All Bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({
      createdAt: -1,
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Tutor Requests
router.get("/tutor/:id", async (req, res) => {
  try {
    const bookings = await Booking.find({
      tutorId: req.params.id,
    }).sort({
      createdAt: -1,
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Learner Bookings
router.get("/learner/:id", async (req, res) => {
  try {
    const bookings = await Booking.find({
      learnerId: req.params.id,
    }).sort({
      createdAt: -1,
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const booking =
      await Booking.findByIdAndUpdate(
        req.params.id,
        {
          status: req.body.status,
        },
        {
          new: true,
        }
      );

    if (
      req.body.status === "accepted"
    ) {
      await Skill.findByIdAndUpdate(
        booking.offerId,
        {
          isBooked: true,
        }
      );
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// Delete Booking
router.delete("/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Booking deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;