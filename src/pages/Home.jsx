import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeroVideo from "../components/HeroVideo";
import movies from "../data/movies";
import MovieCard from "../components/MovieCard";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { Film } from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen text-white font-cinema overflow-hidden">
        {/* 🔽 Blurred Background Image Layer */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-fixed blur-sm opacity-40"
          style={{ backgroundImage: "url('/main.png')" }}
        />

        {/* 🔼 Foreground Content Layer */}
        <div className="relative z-10">
          <HeroVideo />

          {/* Now Showing */}
          <section className="py-20 px-6 sm:px-10 lg:px-20">
            <h2 className="text-4xl font-bold text-center mb-12 tracking-wide drop-shadow-lg">
              Now Showing
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>

          {/* Showtime Info */}
          <section className="py-24 px-6 sm:px-10 lg:px-20 text-center">
            <motion.h2
              className="text-5xl font-bold mb-16 tracking-wider drop-shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Showtime Info
            </motion.h2>

            <motion.div
              className="space-y-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
            >
              <div>
                <p className="uppercase text-sm tracking-widest text-gray-200 mb-2">
                  Ticket Price
                </p>
                <h3 className="text-4xl sm:text-5xl font-bold drop-shadow-lg">35 SAR</h3>
                <p className="text-gray-300 text-sm mt-2">Per person • VAT included</p>
              </div>

              <div>
                <p className="uppercase text-sm tracking-widest text-gray-200 mb-4">
                  Daily Showtimes
                </p>
                <div className="flex justify-center gap-6 flex-wrap">
                  <span className="text-xl sm:text-2xl text-white glow-sm">🎬 6:00 PM</span>
                  <span className="text-xl sm:text-2xl text-white glow-sm">🌙 9:00 PM</span>
                </div>
                <p className="text-gray-300 text-sm mt-3">
                  Open daily from 6:00 PM to 12:00 AM
                </p>
              </div>
            </motion.div>
          </section>

          {/* Browse Movies CTA */}
          <section className="py-24 px-6 sm:px-10 lg:px-20">
            <motion.div
              className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              <div className="text-center md:text-left space-y-6 max-w-xl">
                <h2 className="text-4xl sm:text-5xl font-bold leading-tight drop-shadow-lg">
                  Discover the Full Lineup
                </h2>
                <p className="text-gray-200 text-lg">
                  Explore the full range of films showing at Cinema Al Balad — from timeless classics to new Saudi voices.
                </p>
                <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    to="/movies"
                    className="inline-block mt-4 bg-white/10 text-white border border-white/20 font-cinema text-lg px-8 py-4 rounded-full shadow-md hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    🎥 Browse Movies
                  </Link>
                </motion.div>
              </div>

              <motion.div
                className="text-primary"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                <Film size={140} className="mx-auto animate-pulse-slow text-white/80" />
              </motion.div>
            </motion.div>
          </section>

          {/* Book Now CTA */}
          <section className="py-24 px-6 sm:px-10 lg:px-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <h2 className="text-4xl sm:text-5xl font-bold tracking-wide drop-shadow-lg">
                Ready for the Show?
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-xl mx-auto">
                Reserve your seat now and experience Cinema Al Balad — a journey into the heart of film.
              </p>
              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/book"
                  className="inline-block bg-white/10 text-white border border-white/20 font-cinema text-xl px-8 py-4 rounded-full shadow-xl hover:bg-primary hover:text-white transition-all duration-300"
                >
                  🎟 Book Now
                </Link>
              </motion.div>
            </motion.div>
          </section>

          <Footer />
        </div>
      </main>
    </>
  );
}
