const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.post('/send', async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.get('/:user1/:user2', async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await Message.find({
      $or: [
        {
          senderId: user1,
          receiverId: user2,
        },
        {
          senderId: user2,
          receiverId: user1,
        },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;