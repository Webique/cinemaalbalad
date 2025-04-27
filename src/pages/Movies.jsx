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
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [startIndex, setStartIndex] = useState(0);
  const navigate = useNavigate();

  const generateAllDates = () => {
    const dates = [];
    const today = new Date();
    const end = new Date("2025-06-16");
    while (today <= end) {
      dates.push(new Date(today).toISOString().split("T")[0]);
      today.setDate(today.getDate() + 1);
    }
    return dates;
  };

  const allDates = generateAllDates();
  const visibleDates = allDates.slice(startIndex, startIndex + 3);

  useEffect(() => {
    fetch("https://cinemaalbalad.onrender.com/api/movies")

      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error("Failed to fetch movies:", err));
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.showtimes?.some((s) => s.date === selectedDate)
  );

  const handleBooking = (movieId) => {
    const selected = booking[movieId];
    if (!selected || !selected.time || !selected.count) {
      alert("Please select a showtime and number of tickets.");
      return;
    }
    navigate(`/booknow?movieId=${movieId}&time=${selected.time}&count=${selected.count}`);
  };

  return (
    <>
      <Navbar />
      <main
        className="text-white font-cinema pt-28 min-h-screen"
        style={{
          backgroundImage: "url('/main.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="backdrop-blur-sm bg-black/60 min-h-screen">
          <section className="text-center px-6 sm:px-10 lg:px-20 py-20 space-y-6">
            <motion.h1
              className="text-4xl sm:text-5xl font-cinema drop-shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Movies Showing
            </motion.h1>

            <div className="flex gap-4 justify-center items-center flex-wrap">
              <button
                onClick={() => setStartIndex(Math.max(startIndex - 1, 0))}
                className="px-4 py-2 text-white border border-white/20 bg-white/10 rounded-full text-sm hover:bg-white hover:text-black transition"
              >
                ←
              </button>

              {visibleDates.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`px-5 py-2 rounded-full border ${
                    selectedDate === date
                      ? "bg-primary text-white"
                      : "bg-white/10 text-white border-white/20 hover:bg-white hover:text-black"
                  } transition text-sm`}
                >
                  {new Date(date).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </button>
              ))}

              <button
                onClick={() =>
                  setStartIndex((prev) =>
                    prev + 3 < allDates.length ? prev + 1 : prev
                  )
                }
                className="px-4 py-2 text-white border border-white/20 bg-white/10 rounded-full text-sm hover:bg-white hover:text-black transition"
              >
                →
              </button>
            </div>
          </section>

          <section className="space-y-24 px-6 sm:px-10 lg:px-20 pb-40">
            {filteredMovies.length === 0 ? (
              <div className="text-center text-gray-300 text-lg">No movies on this date.</div>
            ) : (
              filteredMovies.map((movie, index) => (
                <motion.div
                  key={movie._id}
                  className={`flex flex-col ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } items-center gap-10`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Link to={`/movies/${movie._id}`} className="w-full md:w-[55%]">
                    <img
                      src={movie.poster || "/default-poster.jpg"}
                      alt={movie.title}
                      className="w-full h-[400px] sm:h-[500px] md:h-[520px] object-cover rounded-2xl shadow-2xl cursor-pointer hover:scale-105 transition duration-500"
                    />
                  </Link>

                  <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-bold drop-shadow-md">{movie.title}</h2>
                    <p className="text-sm text-gray-300">
                      {movie.runtime || "90 mins"} • {movie.rating || "PG"}
                    </p>
                    <p className="text-gray-200 text-lg">
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
  <div className="flex items-center bg-white/10 border border-white/10 rounded overflow-hidden">
    <button
      type="button"
      className="px-3 py-2 text-white hover:bg-white/20 transition"
      onClick={() =>
        setBooking((prev) => {
          const current = prev[movie._id]?.count || 1;
          return {
            ...prev,
            [movie._id]: {
              ...prev[movie._id],
              count: Math.max(1, current - 1),
            },
          };
        })
      }
    >
      -
    </button>
    <span className="px-4 py-2 text-sm text-white bg-white/5 min-w-[2.5rem] text-center">
      {booking[movie._id]?.count || 1}
    </span>
    <button
      type="button"
      className="px-3 py-2 text-white hover:bg-white/20 transition"
      onClick={() =>
        setBooking((prev) => {
          const current = prev[movie._id]?.count || 1;
          return {
            ...prev,
            [movie._id]: {
              ...prev[movie._id],
              count: Math.min(10, current + 1),
            },
          };
        })
      }
    >
      +
    </button>
  </div>
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
        </div>
      </main>

      {selectedTrailer && (
        <TrailerModal trailerUrl={selectedTrailer} onClose={() => setSelectedTrailer(null)} />
      )}
      <Footer />
    </>
  );
}
