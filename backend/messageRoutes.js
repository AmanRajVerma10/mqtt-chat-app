const express = require('express');
const Message = require('./models/Message');
const authMiddleware = require('./authMiddleware');

const router = express.Router();

// Get chat history
router.get('/:sender/:receiver', authMiddleware, async (req, res) => {
  const { sender, receiver } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Save a message
router.post('/', authMiddleware, async (req, res) => {
  const { sender, receiver, text } = req.body;
  try {
    const message = new Message({ sender, receiver, text });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save message' });
  }
});

module.exports = router;
