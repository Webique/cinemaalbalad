// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Initialize app
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb+srv://startwithwebique:Cinema123%21@cinemaalbalad.gv3a8rw.mongodb.net/cinemaalbalad?retryWrites=true&w=majority&appName=CinemaAlbalad")

  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Routes
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

import Booking from "./models/Booking.js";

app.post("/api/bookings", async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json({ message: "🎟 Booking saved successfully!" });
  } catch (err) {
    console.error("Booking save error:", err);
    res.status(500).json({ error: "Failed to save booking." });
  }
});
