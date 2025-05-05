import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";

export default function ThankYou() {
  const { t } = useTranslation();
  const [bookingData, setBookingData] = useState(null);
  const qrRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("latestBooking");
    if (saved) {
      setBookingData(JSON.parse(saved));
    }
  }, []);

  const seatLabel = (seat) => {
    const row = String.fromCharCode(65 + Math.floor((seat - 1) / 8)); // A–F
    const number = ((seat - 1) % 8) + 1; // 1–8
    return `${row}${number}`;
  };
  

  const handleDownloadPDF = () => {
    if (!bookingData) return;
  
    // 🔠 Manual translation map for known Arabic titles
    const movieTranslations = {
      "الرحلة": "The Journey",
      "عائلة موفم": "Moving Family",
      "سطار": "Sattar",
      "وادي الجن": "Valley of the Jinn",
      "كراكون في الشارع": "Karakon in the Street", // ✅ new addition
    };
    
  
    // 🈁 Get English title or fallback to original
    const translatedMovie = movieTranslations[bookingData.movie] || bookingData.movie;
  
    const doc = new jsPDF();
  
    doc.setFontSize(16);
    doc.text("🎟️ Cinema Al Balad – Ticket Info", 20, 20);
  
    doc.setFontSize(12);
    doc.text(`Name: ${bookingData.name}`, 20, 40);
    doc.text(`Movie: ${translatedMovie}`, 20, 50);
    doc.text(`Date: ${bookingData.date}`, 20, 60);
    doc.text(`Time: ${bookingData.time}`, 20, 70);
    doc.text(`Seats: ${bookingData.seats.map(seatLabel).join(", ")}`, 20, 80);
    doc.text(`Booking Code: ${bookingData._id}`, 20, 90);
  
    // 🧾 QR Code image from canvas
    const qrCanvas = qrRef.current?.querySelector("canvas");
    if (qrCanvas) {
      const imgData = qrCanvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 140, 40, 50, 50);
    }
  
    // 💾 Save file
    doc.save("CinemaTicket.pdf");
  };
  

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen text-white font-cinema overflow-hidden pt-36 px-6 sm:px-10 lg:px-20 pb-32 flex items-center justify-center">
        <div className="fixed top-0 left-0 w-full h-full -z-10">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url('/main.png')" }}
          >
            <div className="w-full h-full bg-black/50 backdrop-blur-sm" />
          </div>
        </div>

        <section className="relative z-10 max-w-3xl w-full text-center space-y-12 bg-black/30 backdrop-blur-md rounded-2xl p-10 shadow-xl">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex justify-center"
          >
            <CheckCircleIcon className="w-24 h-24 text-green-400 drop-shadow-xl animate-pulse" />
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl tracking-wide leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          >
            {t('thankyou.title')}
          </motion.h1>

          {bookingData && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            >
              {/* ✅ Download button */}
              <button
                onClick={handleDownloadPDF}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-all shadow-md hover:scale-105"
              >
                📥 Download Ticket PDF
              </button>

              {/* ✅ Screenshot notice */}
              <p className="text-md text-gray-300">
                Please screenshot this page or click the button above to download your ticket info as a PDF.
              </p>

              {/* ✅ QR Code */}
              <div className="flex justify-center" ref={qrRef}>
                <QRCodeCanvas
                  value={JSON.stringify({
                    _id: bookingData._id,
                    name: bookingData.name,
                    email: bookingData.email,
                    movie: bookingData.movie,
                    date: bookingData.date,
                    time: bookingData.time,
                    seats: bookingData.seats,
                    scanned: false,
                  })}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                  includeMargin={true}
                />
              </div>

              {/* ✅ Booking Info */}
              <div className="text-sm text-gray-300 space-y-1">
                <p>🎟️ <strong>{bookingData.name}</strong> booked <strong>{bookingData.movie}</strong></p>
                <p>🗓️ {bookingData.date} at {bookingData.time} | Seats: {bookingData.seats.map(seatLabel).join(", ")}</p>
                <p>🔐 <span className="text-gray-400">Booking Code:</span> <span className="text-green-400 font-mono">{bookingData._id}</span></p>
              </div>
            </motion.div>
          )}

          {/* ✅ Reservation confirmation text */}
          <motion.p
            className="text-md text-white font-semibold mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.8, ease: "easeOut" }}
          >
            Your reservation is confirmed. We can’t wait to welcome you to Cinema Al Balad. Get ready for an unforgettable experience!
          </motion.p>

          {/* ✅ Buttons */}
          <motion.div
            className="flex justify-center gap-6 flex-wrap mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          >
            <Link
              to="/"
              className="bg-primary hover:bg-primary/80 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-md hover:scale-105"
            >
              ⬅ {t('thankyou.backHome')}
            </Link>
            <Link
              to="/movies"
              className="bg-white hover:bg-gray-200 text-black px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-md hover:scale-105"
            >
              🎬 {t('thankyou.browseMovies')}
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
