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

// ✅ Auto-set selectedDate to queryDate if present
useEffect(() => {
  if (queryDate) {
    setSelectedDate(queryDate);
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
    end.setDate(today.getDate() + 11);

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
  



  const upcomingMoviesByDate = {};
  movies.forEach((movie) => {
    movie.showtimes?.forEach((s) => {
      const showDate =
        typeof s.date === "string"
          ? s.date.length > 10 ? s.date.split("T")[0] : s.date
          : new Date(s.date).toISOString().split("T")[0];
  
      if (showDate >= todayISO) {
        if (!upcomingMoviesByDate[showDate]) {
          upcomingMoviesByDate[showDate] = [];
        }
  
        if (!upcomingMoviesByDate[showDate].some((m) => m._id === movie._id)) {
          upcomingMoviesByDate[showDate].push(movie);
        }
      }
    });
  });
  

  const handleBooking = (movieId) => {
    const selected = booking[movieId];
    if (!selected || !selected.time) {
      alert(t('movies.selectShowtime'));
      return;
    }
    navigate(`/booknow?movieId=${movieId}&time=${selected.time}`);
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
          

        <section className="px-6 sm:px-10 lg:px-20 pt-10 pb-6">
    <motion.h1
      className="text-4xl sm:text-5xl font-cinema drop-shadow-lg text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {t('movies.title')}
    </motion.h1>
  </section>

          <section className="space-y-24 px-6 sm:px-10 lg:px-20 pb-40">
          {Object.keys(upcomingMoviesByDate).length === 0 ? (
  <div className="text-center text-gray-300 text-lg">{t('movies.noMovies')}</div>
) : (
  Object.entries(upcomingMoviesByDate)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, moviesForDate]) => (
      <div key={date} className="space-y-12">
<h2 className="text-2xl font-bold text-primary text-left border-b border-white/10 pb-2">
  🎬 {t('movies.showtimesFor') || 'Showtimes for'} {new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })}
</h2>


        {moviesForDate.map((movie, index) => (
          <motion.div
            key={`${movie._id}-${date}`}
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

              <div className="pt-6 border-t border-white/10 space-y-4 text-center md:text-left">
                <p className="text-primary text-lg font-semibold">{t('movies.bookTickets')}</p>
                <div className="flex gap-4 flex-wrap justify-center md:justify-start">
                  {movie.showtimes
                    .filter((s) => {
                      const sDate = typeof s.date === "string"
                        ? s.date.length > 10 ? s.date.split("T")[0] : s.date
                        : new Date(s.date).toISOString().split("T")[0];
                      return sDate === date;
                    })
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

                {isFreeShowtime(movie, date) ? (
                  <p className="text-sm text-green-400 font-semibold">🎉 Free Screening!</p>
                ) : (
                  <div className="text-sm text-gray-300 flex items-center justify-center md:justify-start gap-2">
                    {t('movies.price')}:
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
        ))}
      </div>
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
