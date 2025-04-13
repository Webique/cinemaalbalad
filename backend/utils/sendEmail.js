import nodemailer from "nodemailer";
import QRCode from "qrcode";

export const sendConfirmationEmail = async ({ to, booking }) => {
  const qrData = `Booking for ${booking.movie} on ${booking.date} at ${booking.time}, Seats: ${booking.seats.join(", ")}`;
  const qrImage = await QRCode.toDataURL(qrData);

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "your-email@gmail.com",      // replace with your Gmail
      pass: "your-app-password",         // NOT your Gmail password (will help you get this)
    },
  });

  const mailOptions = {
    from: "Cinema Al Balad 🎬 <your-email@gmail.com>",
    to: to,
    subject: "🎟 Booking Confirmation",
    html: `
      <h2>Thank you for your booking!</h2>
      <p><strong>Movie:</strong> ${booking.movie}</p>
      <p><strong>Date:</strong> ${booking.date}</p>
      <p><strong>Time:</strong> ${booking.time}</p>
      <p><strong>Seats:</strong> ${booking.seats.join(", ")}</p>
      <p>Show this QR code at the entrance:</p>
      <img src="${qrImage}" alt="QR Code" />
    `,
  };

  await transporter.sendMail(mailOptions);
};
