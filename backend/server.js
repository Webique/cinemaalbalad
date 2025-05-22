// Imports
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Booking from "./models/Booking.js";
import Movie from "./models/Movie.js";


import bcrypt from "bcrypt";
import User from "./models/User.js";
import axios from "axios";

import QRCode from "qrcode";

import { Resend } from 'resend';

const resend = new Resend('re_fceo4BxL_6La3F1aCF1KDKufSXiVEmXg3');


function formatSeat(number) {
  const rowIndex = Math.floor((number - 1) / 8); // 0 = A, 1 = B, ..., 5 = F
  const row = String.fromCharCode(65 + rowIndex); // ASCII 65 = 'A'
  const seatNumber = ((number - 1) % 8) + 1; // 1 to 8
  return `${row}${seatNumber}`;
}



const sendTicketEmail = async (booking, qrCodeData) => {
  try {
    console.log("📤 Attempting to send email to", booking.email); // 🔍 CONFIRM email attempt

    const response = await resend.emails.send({
      from: 'Cinema Al Balad <noreply@cinemaalbalad.com>', // ✅ SAFE DEFAULT SENDER
      to: [booking.email],
      subject: `🎟️ Your Ticket for ${booking.movie}`,
      html: `
        <h2>Hello ${booking.name},</h2>
        <p>Your reservation is confirmed for:</p>
        <ul>
          <li><strong>Movie:</strong> ${booking.movie}</li>
          <li><strong>Date:</strong> ${booking.date}</li>
          <li><strong>Time:</strong> ${booking.time}</li>
          <li><strong>Seats:</strong> ${booking.seats.map(n => formatSeat(Number(n))).join(', ')}</li>

        </ul>
        <p>Your booking ID is: <strong>${booking._id}</strong></p>
        <br/><br/>
        <p>Enjoy your movie! 🍿</p>
        <p>— Cinema Al Balad</p>
      `,
    });

    console.log(`✅ Email sent successfully. Resend message ID:`, response?.id);
  } catch (err) {
    console.error("❌ Failed to send email:");
    console.dir(err, { depth: null });
  }
};

    




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
  const { name, email, movie, date, time, seats, price, paymentId } = req.body;

  console.log("📥 Booking request:", req.body);

  if (!name || !email || !movie || !date || !time || !seats?.length) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // 1. Get movie & showtime
    const movieDoc = await Movie.findOne({ title: movie });
    if (!movieDoc) return res.status(404).json({ error: "Movie not found" });

    const showtime = movieDoc.showtimes.find(s => s.date === date && s.time === time);
    if (!showtime) return res.status(404).json({ error: "Showtime not found" });

    const isFreeScreening = price === 0 || movieDoc.ticketPrice === 0;
    const ticketPrice = isFreeScreening ? 0 : movieDoc.ticketPrice || 35;
    const totalPrice = seats.length * ticketPrice;

    // 2. For paid bookings, verify payment via Moyasar
    if (!isFreeScreening && totalPrice > 0) {
      if (!paymentId) {
        return res.status(400).json({ error: "Missing payment ID for paid booking." });
      }

      try {
        const verifyRes = await axios.get(`https://api.moyasar.com/v1/payments/${paymentId}`, {
          auth: {
            username: "sk_live_jWYvF8kcqYZhurrkMmxFm9dXbgmnGFUbcVySi1oR", // ✅ Your live key
            password: "",
          },
        });

        const payment = verifyRes.data;
        if (payment.status !== "paid") {
          return res.status(402).json({ error: "Payment not completed" });
        }
      } catch (err) {
        console.error("❌ Moyasar verification failed:", err?.response?.data || err.message);
        return res.status(500).json({ error: "Failed to verify payment with Moyasar" });
      }
    }

    // 3. Prevent duplicate seats
    const takenSeats = await Booking.find({ movie, date, time });
    const alreadyBooked = takenSeats.flatMap(b => b.seats);
    const conflict = seats.filter(seat => alreadyBooked.includes(seat));
    if (conflict.length) {
      return res.status(409).json({ error: "Seats already taken", conflict });
    }

      // 4. Prevent duplicate booking (same user + same seats + same showtime)
  const existingBooking = await Booking.findOne({
    email,
    movie,
    date,
    time,
    seats: { $all: seats, $size: seats.length },
  });

  if (existingBooking) {
    console.log("⚠️ Duplicate booking returned:", existingBooking._id);
    return res.status(200).json({
      message: "Booking already exists.",
      bookingId: existingBooking._id,
      qrCodeData: existingBooking.qrCodeData,
    });
  }

  // 5. Save booking
  const newBooking = await Booking.create({
    name, email, movie, date, time, seats, price: totalPrice,
  });


    // 6. Generate QR code
    const payload = JSON.stringify({
      _id: newBooking._id,
      name, email, movie, date, time, seats, scanned: false,
    });


    const qrCodeData = await QRCode.toDataURL(payload);
    newBooking.qrCodeData = qrCodeData;
    await newBooking.save();
    await sendTicketEmail(newBooking, qrCodeData);


    console.log("✅ Booking saved:", newBooking._id);
    res.status(201).json({
      bookingId: newBooking._id,
      qrCodeData,
      message: isFreeScreening
        ? "🎉 Free booking confirmed!"
        : "✅ Paid booking confirmed!",
    });

  } catch (err) {
    console.error("❌ Critical booking error:", err.message);
    res.status(500).json({ error: "Internal server error during booking." });
  }
});




// ✅ FIXED: Dynamically fetch taken seats from bookings collection
app.get("/api/bookings/taken-seats", async (req, res) => {
  try {
    const { movie, date, time } = req.query;

    // Find all bookings for the same movie, date, and time
    const bookings = await Booking.find({ movie, date, time });

    // Merge all booked seats into one array
    const takenSeats = bookings.flatMap((b) => b.seats);

    res.json({ takenSeats });
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

// ✅ Route to add movies for May 25–27
app.post("/api/admin/add-movies-may25-27", async (req, res) => {
  try {
    const newMovies = [
      {
        title: "Maflam Nights",
        runtime: "90 min",
        rating: "PG",
        synopsis: "A special free event. No seating required.",
        poster: "/posters/may25.jpeg",
        trailer: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        ticketPrice: 0,
        showtimes: [
          {
            date: "2025-05-25",
            time: "8:30 PM",
            reservedSeats: [] // You may want to hide seat selection on frontend
          }
        ]
      },
      {
        title: "Kora Nights",
        runtime: "100 min",
        rating: "PG",
        synopsis: "An exciting evening blending football and cinema.",
        poster: "/posters/may26.jpeg",
        trailer: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        ticketPrice: 15,
        showtimes: [
          {
            date: "2025-05-26",
            time: "9:00 PM",
            reservedSeats: []
          }
        ]
      },
      {
        title: "Saudi Cinema Nights",
        runtime: "110 min",
        rating: "PG-13",
        synopsis: "A showcase of top Saudi films in one night.",
        poster: "/posters/may27.jpeg",
        trailer: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        ticketPrice: 25,
        showtimes: [
          {
            date: "2025-05-27",
            time: "7:30 PM",
            reservedSeats: []
          }
        ]
      }
    ];

    await Movie.insertMany(newMovies);
    res.status(201).json({ message: "✅ Movies for May 25–27 added successfully." });
  } catch (err) {
    console.error("❌ Error adding movies:", err);
    res.status(500).json({ error: "Failed to add the new movies." });
  }
});









// Start server LAST
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
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



app.get("/api/verify-payment", async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Missing payment ID" });

  try {
    const response = await axios.get(`https://api.moyasar.com/v1/payments/${id}`, {
      auth: {
        username: "sk_live_jWYvF8kcqYZhurrkMmxFm9dXbgmnGFUbcVySi1oR", // ✅ Use your real secret key
        password: "",
      },
    });

    const payment = response.data;

    if (payment.status === "paid") {
      // Optional: You can log or save the payment
      return res.status(200).json({ success: true, payment });
    } else {
      return res.status(400).json({ success: false, message: "Payment not completed", payment });
    }
  } catch (err) {
    console.error("❌ Error verifying payment:", err.response?.data || err.message);
    res.status(500).json({ error: "Payment verification failed" });
  }
});


// ✅ Verify QR and mark as scanned
app.post("/api/bookings/scan", async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.scanned) {
      return res.status(409).json({ message: "❗ Already scanned" });
    }

    booking.scanned = true;
    await booking.save();

    res.json({ message: "✅ Booking marked as scanned", booking });
  } catch (err) {
    console.error("Scan error:", err);
    res.status(500).json({ error: "Failed to scan booking" });
  }
});

app.get("/api/bookings/by-showtime", async (req, res) => {
  const { movie, date, time } = req.query;
  try {
    const bookings = await Booking.find({ movie, date, time });
    res.json(bookings);
  } catch (err) {
    console.error("Failed to fetch bookings by showtime:", err);
    res.status(500).json({ error: "Failed to fetch bookings." });
  }
});
// ✅ Unscan a booking
app.post("/api/bookings/unscan", async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    booking.scanned = false;
    await booking.save();

    res.json({ message: "✅ Booking unmarked as scanned", booking });
  } catch (err) {
    console.error("Unscan error:", err);
    res.status(500).json({ error: "Failed to unscan booking" });
  }
});

// ✅ Admin route to manually add booking (no payment required)
app.post("/api/admin/manual-booking", async (req, res) => {
  const { name, email, movie, date, time, seats } = req.body;

  if (!name || !email || !movie || !date || !time || !seats?.length) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const movieDoc = await Movie.findOne({ title: movie });
    if (!movieDoc) return res.status(404).json({ error: "Movie not found" });

    const showtime = movieDoc.showtimes.find(s => s.date === date && s.time === time);
    if (!showtime) return res.status(404).json({ error: "Showtime not found" });

    // Prevent double booking
    const existingBookings = await Booking.find({ movie, date, time });
    const bookedSeats = existingBookings.flatMap(b => b.seats);
    const conflict = seats.filter(seat => bookedSeats.includes(seat));
    if (conflict.length > 0) {
      return res.status(409).json({ error: "Seats already taken", conflict });
    }

    const newBooking = await Booking.create({
      name,
      email,
      movie,
      date,
      time,
      seats,
      price: 0, // manually added for free
    });

    const payload = JSON.stringify({
      _id: newBooking._id,
      name,
      email,
      movie,
      date,
      time,
      seats,
      scanned: false,
    });

    const qrCodeData = await QRCode.toDataURL(payload);
    newBooking.qrCodeData = qrCodeData;
    await newBooking.save();
    await sendTicketEmail(newBooking, qrCodeData);

    res.status(201).json({
      message: "✅ Manual booking created",
      bookingId: newBooking._id,
      qrCodeData,
    });

  } catch (err) {
    console.error("❌ Manual booking error:", err.message);
    res.status(500).json({ error: "Internal error while creating manual booking" });
  }
});
