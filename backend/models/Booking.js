// backend/models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  movie: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true },
  seats: { type: [Number], required: true },
  createdAt: { type: Date, default: Date.now },
  qrCodeData: { type: String },
  scanned: { type: Boolean, default: false },

});

export default mongoose.model("Booking", bookingSchema);
