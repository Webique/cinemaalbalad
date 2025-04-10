import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import TrailerModal from "../components/TrailerModal";

export default function Movies() {
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [booking, setBooking] = useState({});
  const [movies, setMovies] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // e.g. "2025-04-25"
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error("Failed to fetch movies:", err));
  }, []);

  const handleBooking = (movieId) => {
    const selected = booking[movieId];
    if (!selected || !selected.time || !selected.count) {
      alert("Please select a showtime and number of tickets.");
      return;
    }
    navigate(`/booknow?movieId=${movieId}&time=${selected.time}&count=${selected.count}`);
  };

  // Get all dates from April 25 – June 25, 2025
  const allDates = [];
  for (let d = new Date(2025, 3, 25); d <= new Date(2025, 5, 25); d.setDate(d.getDate() + 1)) {
    allDates.push(new Date(d).toISOString().split("T")[0]);
  }

  // Filter movies by selected date
  const filteredMovies = movies.filter((movie) =>
    movie.showtimes?.some((s) => s.date === selectedDate)
  );

  return (
    <>
      <Navbar />

      <main className="bg-gradient-to-b from-secondary via-black to-secondary text-white font-cinema pt-28">
        {/* Page Title + Date Selector */}
        <section className="text-center px-6 sm:px-10 lg:px-20 py-16">
          <motion.h1
            className="text-4xl sm:text-5xl font-cinema mb-4"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Movies Showing On
          </motion.h1>

          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-4 px-4 py-2 rounded text-black font-semibold"
          >
            {allDates.map((date) => (
              <option key={date} value={date}>
                {new Date(date).toDateString()}
              </option>
            ))}
          </select>
        </section>

        {/* Movie Cards */}
        <section className="space-y-24 px-6 sm:px-10 lg:px-20 pb-32">
          {filteredMovies.length === 0 ? (
            <div className="text-center text-gray-400 text-lg">No movies on this date.</div>
          ) : (
            filteredMovies.map((movie, index) => (
              <motion.div
                key={movie._id}
                className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-10`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                {/* Poster */}
                <Link to={`/movies/${movie._id}`} className="w-full md:w-[55%]">
                  <img
                    src={movie.poster || "/default-poster.jpg"}
                    alt={movie.title}
                    className="w-full h-[400px] sm:h-[500px] md:h-[520px] object-cover rounded-2xl shadow-2xl cursor-pointer hover:scale-105 transition duration-500"
                  />
                </Link>

                {/* Info + Booking */}
                <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
                  <h2 className="text-3xl sm:text-4xl">{movie.title}</h2>
                  <p className="text-sm text-gray-400">
                    {movie.runtime || "90 mins"} • {movie.rating || "PG"}
                  </p>
                  <p className="text-gray-300 text-lg">
                    {movie.synopsis || "A wonderful movie experience awaits."}
                  </p>

                  {movie.trailer && (
                    <button
                      onClick={() => setSelectedTrailer(movie.trailer)}
                      className="mt-2 text-primary hover:underline"
                    >
                      ▶ Watch Trailer
                    </button>
                  )}

                  {/* Showtimes for selected date only */}
                  <div className="pt-6 border-t border-white/10 space-y-4">
                    <p className="text-primary text-lg font-semibold">Book Tickets</p>

                    <div className="flex gap-4 flex-wrap">
                      {movie.showtimes
                        .filter((s) => s.date === selectedDate)
                        .map((s) => (
                          <button
                            key={s.time}
                            onClick={() =>
                              setBooking((prev) => ({
                                ...prev,
                                [movie._id]: {
                                  time: s.time,
                                  count: prev[movie._id]?.count || 1,
                                },
                              }))
                            }
                            className={`px-4 py-2 rounded-full text-sm border ${
                              booking[movie._id]?.time === s.time
                                ? "bg-primary text-white"
                                : "bg-white/10 text-white hover:bg-primary/80"
                            } transition duration-300`}
                          >
                            {s.time}
                          </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="text-sm text-gray-300">Tickets:</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={booking[movie._id]?.count || 1}
                        onChange={(e) =>
                          setBooking((prev) => ({
                            ...prev,
                            [movie._id]: {
                              ...prev[movie._id],
                              count: parseInt(e.target.value),
                            },
                          }))
                        }
                        className="w-20 px-3 py-2 bg-white/10 border border-white/10 rounded text-white text-sm backdrop-blur-md"
                      />
                    </div>

                    <div className="text-sm text-gray-300">
                      Total:{" "}
                      <span className="text-white font-bold">
                        {(booking[movie._id]?.count || 1) * (movie.ticketPrice || 35)} SAR
                      </span>
                    </div>

                    <button
                      onClick={() => handleBooking(movie._id)}
                      className="mt-2 bg-primary text-white px-6 py-2 rounded-full hover:scale-105 transition duration-300 font-cinema"
                    >
                      🎟 Confirm Booking
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
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
