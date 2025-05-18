import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function BookingFailed() {
  return (
    <motion.div
      className="min-h-screen flex flex-col justify-center items-center bg-black text-white text-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-4xl font-bold mb-4">Booking Failed</h1>
      <p className="text-lg mb-6">
        Something went wrong while processing your payment.
      </p>
      <Link
        to="/movies"
        className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl transition"
      >
        Go Back to Movies
      </Link>
    </motion.div>
  );
}
