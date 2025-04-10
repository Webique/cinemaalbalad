// Imports
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Booking from "./models/Booking.js";
import Movie from "./models/Movie.js";


import bcrypt from "bcrypt";
import User from "./models/User.js";


// App config
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb+srv://startwithwebique:Cinema123%21@cinemaalbalad.gv3a8rw.mongodb.net/cinemaalbalad?retryWrites=true&w=majority&appName=CinemaAlbalad")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB error:", err));



  // ✅ GET all movies from the database
app.get("/api/movies", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    console.error("❌ Error fetching movies:", err);
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});


// Routes
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.post("/api/bookings", async (req, res) => {
  try {
    const { name, email, movie, date, time, seats } = req.body;
    console.log("📥 Booking request received:", req.body);

    // Find the movie
    const movieDoc = await Movie.findOne({ title: movie });
    if (!movieDoc) return res.status(404).json({ error: "Movie not found" });

    // Find the showtime
    const showtime = movieDoc.showtimes.find(
      (s) => s.date === date && s.time === time
    );
    if (!showtime) return res.status(404).json({ error: "Showtime not found" });

    // Check for already taken seats
    const alreadyTaken = seats.filter((seat) => showtime.reservedSeats.includes(seat));
    if (alreadyTaken.length > 0) {
      return res.status(409).json({
        error: "Some seats are already taken",
        takenSeats: alreadyTaken,
      });
    }

    // Save the booking
    const newBooking = new Booking({ name, email, movie, date, time, seats });
    await newBooking.save();

    // Update the reserved seats
    showtime.reservedSeats.push(...seats);
    await movieDoc.save();

    res.status(201).json({ message: "✅ Booking confirmed!" });
  } catch (err) {
    console.error("Booking save error:", err);
    res.status(500).json({ error: "Failed to save booking." });
  }
});


// GET taken seats for a specific movie, date, and time
app.get("/api/bookings/taken-seats", async (req, res) => {
  try {
    const { movie, date, time } = req.query;

    const movieDoc = await Movie.findOne({ title: movie });
    if (!movieDoc) return res.status(404).json({ error: "Movie not found" });

    const showtime = movieDoc.showtimes.find(
      (s) => s.date === date && s.time === time
    );
    if (!showtime) return res.status(404).json({ error: "Showtime not found" });

    res.json({ takenSeats: showtime.reservedSeats || [] });
  } catch (err) {
    console.error("Error getting taken seats:", err);
    res.status(500).json({ error: "Failed to get taken seats" });
  }
});



app.get("/api/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (err) {
    console.error("❌ Movie fetch error:", err);
    res.status(500).json({ error: "Failed to fetch movie" });
  }
});




// ✅ Seed 23 formatted movies for frontend
app.post("/api/admin/seed-movies-formatted", async (req, res) => {
  try {
    const movies = [];

    for (let i = 1; i <= 23; i++) {
      movies.push({
        title: `Movie ${i}`,
        runtime: "120 min",
        rating: "PG-13",
        synopsis: `This is a placeholder synopsis for Movie ${i}.`,
        poster: `/posters/movie${i}.jpg`,
        trailer: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        ticketPrice: 35,
        showtimes: [
          { time: "6:00 PM", date: "2025-05-01", seats: [] },
          { time: "9:00 PM", date: "2025-05-01", seats: [] },
        ],
      });
    }

    await Movie.deleteMany({});
    await Movie.insertMany(movies);

    res.status(201).json({ message: "✅ Formatted movies seeded successfully!" });
  } catch (err) {
    console.error("Seeding formatted movies error:", err);
    res.status(500).json({ error: "Failed to seed formatted movies." });
  }
});





// Start server LAST
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered." });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashed });
    await newUser.save();

    res.status(201).json({ message: "✅ Signup successful!" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Failed to sign up." });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Incorrect password." });

    res.status(200).json({ message: "✅ Login successful!", user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed." });
  }
});



// Admin stats route
app.get("/api/admin/stats", async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments();
    const allBookings = await Booking.find();
    const totalRevenue = allBookings.reduce((sum, b) => sum + b.seats.length * 35, 0); // Assuming 35 SAR per ticket

    res.json({ totalBookings, totalUsers, totalRevenue });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Admin bookings route
app.get("/api/admin/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Admin bookings error:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

import fs from "fs";
import path from "path";

app.post("/api/admin/seed-movies-calendar", async (req, res) => {
  try {
    const data = fs.readFileSync(path.resolve("seed_movies_calendar.json"), "utf-8");
    const movies = JSON.parse(data);

    await Movie.deleteMany({});
    await Movie.insertMany(movies);

    res.status(201).json({ message: "✅ Movies seeded with full calendar!" });
  } catch (err) {
    console.error("Seeding calendar movies error:", err);
    res.status(500).json({ error: "Failed to seed calendar movies." });
  }
});
// TEMPORARY ROUTE TO DELETE ALL MOVIES
app.delete("/api/admin/delete-all-movies", async (req, res) => {
  try {
    await Movie.deleteMany({});
    res.status(200).json({ message: "🗑️ All movies deleted successfully!" });
  } catch (err) {
    console.error("❌ Error deleting movies:", err);
    res.status(500).json({ error: "Failed to delete movies" });
  }
});


