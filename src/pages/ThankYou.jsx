import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function ThankYou() {
  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-b from-secondary via-black to-secondary text-white font-cinema pt-36 min-h-screen px-6 sm:px-10 lg:px-20 pb-32">
        <section className="max-w-3xl mx-auto text-center space-y-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <CheckCircleIcon className="w-24 h-24 text-green-400 drop-shadow-lg" />
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Thank You for Booking!
          </motion.h1>

          <motion.p
            className="text-lg text-gray-300 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Your reservation is confirmed. We can’t wait to welcome you to Cinema Al Balad!
          </motion.p>

          <motion.div
            className="flex justify-center gap-6 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link
              to="/"
              className="bg-primary text-white px-6 py-3 rounded-full hover:scale-105 transition-all"
            >
              ⬅ Back to Home
            </Link>
            <Link
              to="/movies"
              className="bg-white text-black px-6 py-3 rounded-full hover:scale-105 transition-all"
            >
              🎬 Browse More Movies
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
