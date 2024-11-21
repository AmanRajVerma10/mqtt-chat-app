const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const messageRoutes=require("./messageRoutes");
const authMiddleware = require("./authMiddleware");
const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Connect to MongoDB (replace with your MongoDB URI)
mongoose
  .connect(
    "mongodb+srv://vermaaman464:XF2USCk6nbtIDa3n@cluster0.ayvzu.mongodb.net/chat_db?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Use authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/messages", authMiddleware, messageRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT}`
  );
});
