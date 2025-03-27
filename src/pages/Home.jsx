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
      <main className="bg-secondary text-white font-cinema">
        <HeroVideo />

        {/* Now Showing */}
        <section className="py-20 px-6 sm:px-10 lg:px-20 bg-gradient-to-b from-secondary via-black to-secondary">
          <h2 className="text-4xl font-cinema text-center text-white mb-12 tracking-wide">
            Now Showing
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Showtime Info */}
        <section className="py-24 px-6 sm:px-10 lg:px-20 bg-gradient-to-b from-secondary via-black to-secondary text-white text-center">
          <motion.h2
            className="text-5xl font-cinema mb-16 tracking-wider"
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
            {/* Ticket Price */}
            <div>
              <p className="uppercase text-sm tracking-widest text-gray-400 mb-2">Ticket Price</p>
              <h3 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                35 SAR
              </h3>
              <p className="text-gray-400 text-sm mt-2">Per person • VAT included</p>
            </div>

            {/* Showtimes */}
            <div>
              <p className="uppercase text-sm tracking-widest text-gray-400 mb-4">Daily Showtimes</p>
              <div className="flex justify-center gap-6 flex-wrap">
                <span className="text-xl sm:text-2xl font-cinema text-primary glow-sm">🎬 6:00 PM</span>
                <span className="text-xl sm:text-2xl font-cinema text-primary glow-sm">🌙 9:00 PM</span>
              </div>
              <p className="text-gray-400 text-sm mt-3">Open daily from 6:00 PM to 12:00 AM</p>
            </div>
          </motion.div>
        </section>

        {/* Browse Movies CTA */}
        <section className="py-24 px-6 sm:px-10 lg:px-20 bg-black text-white">
          <motion.div
            className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            {/* Text */}
            <div className="text-center md:text-left space-y-6 max-w-xl">
              <h2 className="text-4xl sm:text-5xl font-cinema leading-tight">
                Discover the Full Lineup
              </h2>
              <p className="text-gray-400 text-lg">
                Explore the full range of films showing at Cinema Al Balad — from timeless classics to new Saudi voices.
              </p>
              <motion.div
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
              >
                <Link
                  to="/movies"
                  className="inline-block mt-4 bg-primary text-white font-cinema text-lg px-8 py-4 rounded-full shadow-md hover:shadow-xl transition duration-300"
                >
                  🎥 Browse Movies
                </Link>
              </motion.div>
            </div>

            {/* Icon */}
            <motion.div
              className="text-primary"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <Film size={140} className="mx-auto animate-pulse-slow" />
            </motion.div>
          </motion.div>
        </section>

        {/* Book Now CTA */}
        <section className="py-24 px-6 sm:px-10 lg:px-20 bg-gradient-to-b from-secondary via-black to-secondary text-white text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-4xl sm:text-5xl font-cinema tracking-wide">
              Ready for the Show?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-xl mx-auto">
              Reserve your seat now and experience Cinema Al Balad — a journey into the heart of film.
            </p>
            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/book"
                className="inline-block bg-primary text-white font-cinema text-xl px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                🎟 Book Now
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* About Section */}
        <section className="py-24 px-6 sm:px-10 lg:px-28 bg-gradient-to-b from-secondary via-black to-secondary text-white">
          <div className="max-w-5xl mx-auto space-y-16">
            <motion.h2
              className="text-4xl sm:text-5xl font-cinema text-center tracking-wide"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              About Cinema Al Balad
            </motion.h2>
            {[
              "Cinema Al Balad is inspired by Al-Jumjum Cinema, the first open-air cinema in Saudi Arabia. This pioneering space laid the foundation for outdoor film screenings across the historic neighborhoods of Jeddah, where tickets were just 10 SAR and showtimes began at 7:00 PM and 9:00 PM.",
              "Under the name Fouad Jumjum Studios, Jumjum produced and distributed over 30 cinematic titles, hosting some of the most iconic stars of Egyptian cinema — including Adel Imam, Mahmoud Yassin, Hussein Fahmy, and Farid Shawqi — and frequently invited them to Jeddah for local screenings and cultural exchanges.",
              "Cinema Al Balad continues that legacy, showcasing a rich mix of Saudi films, classic cinema, and global masterpieces. We aim to highlight local talent by curating a calendar filled with short films, features, and documentaries from both emerging and established Saudi filmmakers.",
              "We're building partnerships with major regional film festivals, such as the Saudi Film Festival, as a first step toward hosting Arab and international premieres. These screenings will invite directors, actors, and producers to engage directly with audiences and foster deeper cultural dialogue.",
              "Beyond screenings, Cinema Al Balad will offer a series of cinema workshops and creative panels, featuring acclaimed directors, actors, cinematographers, screenwriters, composers, editors, and more — drawn from both local and global industries.",
              "Our vision is for Cinema Al Balad to be more than just a venue — it’s a vibrant gathering space where artists and film lovers can share their work, exchange ideas, and bring powerful stories to life.",
            ].map((text, index) => (
              <motion.p
                key={index}
                className="text-lg sm:text-xl leading-relaxed text-gray-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {text}
              </motion.p>
            ))}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
