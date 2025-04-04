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
    console.log("📥 Booking payload received:", req.body); // ✅ Add this

    const newBooking = new Booking(req.body);
    await newBooking.save();

    console.log("✅ Booking saved to MongoDB:", newBooking); // ✅ Add this too

    res.status(201).json({ message: "🎟 Booking saved successfully!" });
  } catch (err) {
    console.error("Booking save error:", err);
    res.status(500).json({ error: "Failed to save booking." });
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



