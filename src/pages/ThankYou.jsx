import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";

export default function ThankYou() {
  const { t } = useTranslation();
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("latestBooking");
    if (saved) {
      setBookingData(JSON.parse(saved));
    }
  }, []);

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

          <motion.p
            className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          >
            {t('thankyou.subtitle')}
          </motion.p>

          {/* ✅ QR Code Block */}
          {bookingData && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-2xl font-semibold">{t('thankyou.qrTitle') || 'Your Booking QR Code'}</h2>
              <div className="flex justify-center">
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
              <div className="text-sm text-gray-300 space-y-1">
                <p>🎟️ <strong>{bookingData.name}</strong> booked <strong>{bookingData.movie}</strong></p>
                <p>🗓️ {bookingData.date} at {bookingData.time} | Seats: {bookingData.seats.join(", ")}</p>
                <p>🔐 <span className="text-gray-400">Booking Code:</span> <span className="text-green-400 font-mono">{bookingData._id}</span></p>
                <p>📍 Scanned: ❌</p>
              </div>
              <motion.p
                className="text-md text-gray-300 mt-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
              >
                Here to screenshot or press here to download the ticket info with all the details in a PDF.
              </motion.p>
            </motion.div>
          )}

          <motion.div
            className="flex justify-center gap-6 flex-wrap mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
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
