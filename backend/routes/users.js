const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.get('/list/:id', async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.params.id },
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, skillsOffered, skillsWanted } =
      req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Email already registered',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      skillsOffered: skillsOffered || [],
      skillsWanted: skillsWanted || [],
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        error: 'Invalid password',
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const user =
      await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.json(user);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;