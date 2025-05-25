import mongoose from "mongoose";
import QRCode from "qrcode";
import Booking from "./models/Booking.js";
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend('re_fceo4BxL_6La3F1aCF1KDKufSXiVEmXg3');

const MONGO_URI = "mongodb+srv://startwithwebique:Cinema123!@cinemaalbalad.gv3a8rw.mongodb.net/cinemaalbalad";

const sendTicketEmail = async (booking, qrCodeData) => {
  try {
    const response = await resend.emails.send({
      from: 'Cinema Al Balad <noreply@cinemaalbalad.com>',
      to: [booking.email],
      subject: `🎟️ Your Ticket for ${booking.movie}`,
      html: `
        <h2>Hello ${booking.name},</h2>
        <p>Your reservation is confirmed for:</p>
        <ul>
          <li><strong>Movie:</strong> ${booking.movie}</li>
          <li><strong>Date:</strong> ${booking.date}</li>
          <li><strong>Time:</strong> ${booking.time}</li>
          <li><strong>Seats Booked:</strong> ${booking.seats.length}</li>
        </ul>
        <p>Your booking ID is: <strong>${booking._id}</strong></p>

        <br/><hr/><br/>

        <h2 dir="rtl" style="text-align: right;">مرحباً ${booking.name}،</h2>
        <p dir="rtl" style="text-align: right;">تم تأكيد حجزك لما يلي:</p>
        <ul dir="rtl" style="text-align: right;">
          <li><strong>الفيلم:</strong> ${booking.movie}</li>
          <li><strong>التاريخ:</strong> ${booking.date}</li>
          <li><strong>الوقت:</strong> ${booking.time}</li>
          <li><strong>عدد المقاعد المحجوزة:</strong> ${booking.seats.length}</li>
        </ul>
        <p dir="rtl" style="text-align: right;">رقم الحجز الخاص بك: <strong>${booking._id}</strong></p>

        <br/><br/>
        <p>Enjoy your movie! 🍿</p>
        <p>— Cinema Al Balad</p>
      `,
    });

    console.log("✅ Email sent via Resend. Message ID:", response?.id);
  } catch (err) {
    console.error("❌ Email sending failed:", err);
  }
};

async function main() {
  await mongoose.connect(MONGO_URI);

  const booking = await Booking.findById("68336bf8c95af42f271995cd");

  if (!booking) {
    console.error("❌ Booking not found");
    return;
  }

  const payload = JSON.stringify({
    _id: booking._id,
    name: booking.name,
    email: booking.email,
    movie: booking.movie,
    date: booking.date,
    time: booking.time,
    seats: booking.seats,
    scanned: false,
  });

  const qrCodeData = await QRCode.toDataURL(payload);
  booking.qrCodeData = qrCodeData;
  await booking.save();

  await sendTicketEmail(booking, qrCodeData);

  console.log("🎉 Done! Ticket sent to:", booking.email);
  process.exit(0);
}

main();
