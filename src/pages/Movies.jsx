import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import TrailerModal from "../components/TrailerModal";
import { useTranslation } from "react-i18next";

export default function Movies() {
  const { t } = useTranslation();

  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [booking, setBooking] = useState({});
  const [movies, setMovies] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryDate = searchParams.get("date");
  const todayISO = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(queryDate || todayISO);

  // ✅ Auto-set to May 21 if queryDate is "2025-05-21"
  useEffect(() => {
    if (queryDate === "2025-05-21") {
      setSelectedDate("2025-05-21");
    }
  }, [queryDate]);
  
  const [startIndex, setStartIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isFreeShowtime = (movie, date) =>
    movie.title === "Maflam Nights" &&
    movie.showtimes?.some((s) => s.date === "2025-05-07" && date === "2025-05-07");

  const generateAllDates = () => {
    const dates = [];
    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + 6);

    while (today <= end) {
      dates.push(new Date(today).toISOString().split("T")[0]);
      today.setDate(today.getDate() + 1);
    }
    return dates;
  };

  const allDates = generateAllDates();
  const visibleDates = allDates.slice(startIndex, startIndex + 3);

  useEffect(() => {
    const loadMovies = async () => {
      const fetchStart = performance.now();
  
      try {
        const res = await fetch("https://cinemaalbalad.onrender.com/api/movies");
        const data = await res.json();
        setMovies(data);
  
        const elapsed = performance.now() - fetchStart;
        const delay = Math.max(0, 2000 - elapsed);
        setTimeout(() => {
          setIsLoading(false);
        }, delay);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setIsLoading(false);
      }
    };
  
    loadMovies();
  }, []);
  

  const filteredMovies = movies.filter((movie) =>
    movie.showtimes?.some((s) => {
      const dbDate =
        typeof s.date === "string"
          ? s.date.length > 10 ? s.date.split("T")[0] : s.date
          : new Date(s.date).toISOString().split("T")[0];
  
      // ✅ Only show movies on May 21 if queryDate is May 21
      if (queryDate === "2025-05-21") {
        return dbDate === "2025-05-21";
      }
  
      return dbDate === selectedDate;
    })
  );
  

  const handleBooking = (movieId) => {
    const selected = booking[movieId];
    if (!selected || !selected.time || !selected.count) {
      alert(t('movies.selectShowtime'));
      return;
    }
    navigate(`/booknow?movieId=${movieId}&time=${selected.time}&count=${selected.count}`);
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main
          className="flex items-center justify-center min-h-screen bg-black text-white font-cinema"
          style={{
            backgroundImage: "url('/main.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="backdrop-blur-sm bg-black/60 w-full h-full flex flex-col items-center justify-center px-6 py-20 space-y-6">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-opacity-70"></div>
            <p className="text-lg">{t('movies.loading') || "Loading movies..."}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  

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
              {t('movies.title')}
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
    onClick={() => {
      setSelectedDate(date);
      setSearchParams({ date });
    }}
    className={`px-5 py-2 rounded-full border ${
      selectedDate === date || (queryDate === "2025-05-21" && date === "2025-05-21")
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
              <div className="text-center text-gray-300 text-lg">{t('movies.noMovies')}</div>
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
                  <div className="w-full md:w-[55%] inline-block rounded-2xl shadow-2xl bg-black">
                    <img
                      src={movie.poster || "/default-poster.jpg"}
                      alt={movie.title}
                      className="w-full h-auto object-contain rounded-2xl shadow-2xl"
                    />
                  </div>

                  <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
                    <h2 className="text-3xl sm:text-4xl font-bold drop-shadow-md">{movie.title}</h2>
                    <p className="text-sm text-gray-300">
                      {movie.runtime || t('movies.defaultRuntime')} • {movie.rating || t('movies.defaultRating')}
                    </p>

                    <div className="pt-6 border-t border-white/10 space-y-4">
                      <p className="text-primary text-lg font-semibold">{t('movies.bookTickets')}</p>
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
                        <label className="text-sm text-gray-300">{t('movies.tickets')}:</label>
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

                      {isFreeShowtime(movie, selectedDate) ? (
                        <p className="text-sm text-green-400 font-semibold">🎉 Free Screening!</p>
                      ) : (
                        <div className="text-sm text-gray-300 flex items-center gap-2">
                          {t('movies.total')}:
                          <span className="text-white font-bold flex items-center gap-1">
                          {(() => {
                            const count = booking[movie._id]?.count || 1;
                            const price = movie.ticketPrice !== undefined ? movie.ticketPrice : 35;
                            return count * price;
                          })()}

                            <img
                              src="/saudi-riyal.png"
                              alt="SAR"
                              className="w-5 h-5 sm:w-6 sm:h-6"
                            />
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => handleBooking(movie._id)}
                        className="mt-2 bg-primary text-white px-6 py-2 rounded-full hover:scale-105 transition duration-300 font-cinema"
                      >
                        🎟 {t('movies.confirm')}
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
