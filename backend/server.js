const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const skillRoutes = require('./routes/skills');
require('dotenv').config();

const userRoutes = require('./routes/users');
const chatRoutes = require('./routes/chat');

const app = express();

const bookingRoutes = require('./routes/bookings');

app.use(cors());
app.use(express.json());

app.use('/api/skills', skillRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => {
    console.log(err);
  });

app.get('/', (req, res) => {
  res.json({
    message: 'SkillSwap Backend Running',
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});