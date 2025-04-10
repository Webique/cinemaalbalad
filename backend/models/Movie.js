import mongoose from "mongoose";

showtimes: [
  {
    time: String,
    date: String,
    seats: [Number],          // optional
    reservedSeats: [Number]   // required!
  }
]

const movieSchema = new mongoose.Schema({
  title: String,
  poster: String,
  trailer: String,
  runtime: String,
  rating: String,
  synopsis: String,
  ticketPrice: Number,
  showtimes: [
    {
      time: String,
      date: String,
      seats: [Number],
      reservedSeats: {
        type: [Number],
        default: [], // ✅ Important
      },
    },
  ],
});



const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
