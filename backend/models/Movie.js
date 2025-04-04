import mongoose from "mongoose";

const showtimeSchema = new mongoose.Schema({
  time: String,
  date: String,
  seats: [Number], // Array of reserved seat numbers
});

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  runtime: { type: String, default: "120 min" },
  rating: { type: String, default: "PG" },
  synopsis: { type: String, default: "A captivating story that unfolds with emotion and drama." },
  poster: { type: String, default: "/posters/default.jpg" },
  trailer: { type: String, default: "" },
  ticketPrice: { type: Number, default: 35 },
  showtimes: [showtimeSchema],
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
