// backend/models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  movie: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true },
  seats: { type: [Number], required: true },
  scanned: { type: Boolean, default: false },
  qrCodeData: { type: String }, // ✅ Add this line
  createdAt: { type: Date, default: Date.now },
});


export default mongoose.model("Booking", bookingSchema);
