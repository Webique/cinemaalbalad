import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import movies from "../data/movies";
import { motion } from "framer-motion";
import TrailerModal from "../components/TrailerModal";

export default function Movies() {
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [booking, setBooking] = useState({});
  const navigate = useNavigate();

  const handleBooking = (movieId) => {
    const selected = booking[movieId];
    if (!selected || !selected.time || !selected.count) {
      alert("Please select a showtime and number of tickets.");
      return;
    }
    navigate(`/book?movieId=${movieId}&time=${selected.time}&count=${selected.count}`);
  };

  return (
    <>
      <Navbar />

      <main className="bg-gradient-to-b from-secondary via-black to-secondary text-white font-cinema pt-28">
        {/* Filter Strip */}
        <section className="mt-16 px-6 sm:px-10 lg:px-20 pb-12">
          <div className="max-w-6xl mx-auto space-y-8">
            <h3 className="text-center text-2xl font-cinema">Browse By</h3>
            <div className="relative">
              <div className="absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-secondary via-transparent to-transparent pointer-events-none z-10" />
              <div className="absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-secondary via-transparent to-transparent pointer-events-none z-10" />
              <div className="overflow-x-auto scrollbar-hide px-2 sm:px-4">
                <div className="flex gap-6 justify-start sm:justify-center flex-nowrap text-sm sm:text-base font-medium">
                  {[
                    { type: "Genre", options: ["All", "Drama", "Action", "Comedy", "Documentary"] },
                    { type: "Showtime", options: ["All", "6:00 PM", "9:00 PM"] },
                    { type: "Rating", options: ["All", "G", "PG", "PG-13", "R"] },
                  ].map((filterGroup, groupIdx) => (
                    <div key={groupIdx} className="flex gap-2 sm:gap-3 items-center shrink-0">
                      <span className="text-gray-400 uppercase tracking-widest text-xs whitespace-nowrap">
                        {filterGroup.type}
                      </span>
                      {filterGroup.options.map((option, index) => (
                        <button
                          key={index}
                          className="relative px-4 py-2 rounded-full bg-white/5 hover:bg-primary hover:text-white transition-all duration-300 text-white border border-white/10 backdrop-blur-lg whitespace-nowrap"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Page Title */}
        <section className="text-center px-6 sm:px-10 lg:px-20 py-16">
          <motion.h1
            className="text-4xl sm:text-5xl font-cinema mb-4"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            All Movies
          </motion.h1>
          <motion.p
            className="text-gray-300 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            A curated selection of Saudi cinema, timeless classics, and global masterpieces.
          </motion.p>
        </section>

        {/* Movie Cards */}
        <section className="space-y-24 px-6 sm:px-10 lg:px-20 pb-32">
          {movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              className={`flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-10`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              {/* Poster */}
              <Link to={`/movies/${movie.id}`} className="w-full md:w-[55%]">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-[400px] sm:h-[500px] md:h-[520px] object-cover rounded-2xl shadow-2xl cursor-pointer hover:scale-105 transition duration-500"
                />
              </Link>

              {/* Info + Booking */}
              <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
                <h2 className="text-3xl sm:text-4xl">{movie.title}</h2>
                <p className="text-sm text-gray-400">
                  {movie.runtime} • {movie.rating}
                </p>
                <p className="text-gray-300 text-lg">{movie.synopsis}</p>

                {/* Trailer Button */}
                <button
                  onClick={() => setSelectedTrailer(movie.trailer)}
                  className="mt-2 text-primary hover:underline"
                >
                  ▶ Watch Trailer
                </button>

                {/* Booking */}
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <p className="text-primary text-lg font-semibold">Book Tickets</p>

                  <div className="flex gap-4 flex-wrap">
                    {["6:00 PM", "9:00 PM"].map((time) => (
                      <button
                        key={time}
                        onClick={() =>
                          setBooking((prev) => {
                            const current = prev[movie.id]?.time;
                            return {
                              ...prev,
                              [movie.id]: {
                                ...prev[movie.id],
                                time: current === time ? null : time
                              }
                            };
                          })
                        }
                        className={`px-4 py-2 rounded-full text-sm border ${
                          booking[movie.id]?.time === time
                            ? "bg-primary text-white"
                            : "bg-white/10 text-white hover:bg-primary/80"
                        } transition duration-300`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="text-sm text-gray-300">Tickets:</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={booking[movie.id]?.count || 1}
                      onChange={(e) =>
                        setBooking((prev) => ({
                          ...prev,
                          [movie.id]: {
                            ...prev[movie.id],
                            count: parseInt(e.target.value),
                          },
                        }))
                      }
                      className="w-20 px-3 py-2 bg-white/10 border border-white/10 rounded text-white text-sm backdrop-blur-md"
                    />
                  </div>

                  <div className="text-sm text-gray-300">
                    Total: {" "}
                    <span className="text-white font-bold">
                      {(booking[movie.id]?.count || 1) * movie.ticketPrice} SAR
                    </span>
                  </div>

                  <button
                    onClick={() => handleBooking(movie.id)}
                    className="mt-2 bg-primary text-white px-6 py-2 rounded-full hover:scale-105 transition duration-300 font-cinema"
                  >
                    🎟 Confirm Booking
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Trailer Modal */}
        {selectedTrailer && (
          <TrailerModal trailerUrl={selectedTrailer} onClose={() => setSelectedTrailer(null)} />
        )}
      </main>

      <Footer />
    </>
  );
}
