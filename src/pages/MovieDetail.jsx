import { useParams, Link } from "react-router-dom";
import movies from "../data/movies";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function MovieDetail() {
  const { id } = useParams();
  const movie = movies.find((m) => m.id === Number(id));

  if (!movie) {
    return (
      <>
        <Navbar />
        <main className="pt-44 text-center text-white font-cinema min-h-screen bg-secondary">
          <h2 className="text-3xl">Movie not found 😢</h2>
          <Link to="/movies" className="mt-4 inline-block text-primary underline">
            ← Back to Movies
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-b from-secondary via-black to-secondary text-white font-cinema pt-32 px-6 sm:px-8 md:px-16 lg:px-24 min-h-screen">
        <div className="mb-10">
          <Link
            to="/movies"
            className="inline-block text-primary hover:text-white text-sm sm:text-base transition duration-300"
          >
            ← Back to Movies
          </Link>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Poster */}
          <motion.img
            src={movie.poster}
            alt={movie.title}
            className="w-full md:w-1/2 rounded-2xl shadow-xl object-cover max-h-[600px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          />

          {/* Info */}
          <motion.div
            className="w-full md:w-1/2 space-y-6 text-center md:text-left"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl font-cinema">{movie.title}</h1>
            <p className="text-gray-400">{movie.runtime} • {movie.rating}</p>
            <p className="text-lg text-gray-300">{movie.synopsis}</p>

            {/* Trailer (optional) */}
            {movie.trailer && (
              <a
                href={movie.trailer}
                target="_blank"
                className="text-primary hover:underline block"
              >
                ▶ Watch Trailer
              </a>
            )}

            {/* Book Now Button */}
            <Link to={`/book?movieId=${movie.id}`}>
              <button className="mt-6 bg-primary text-white px-8 py-3 rounded-full hover:scale-105 transition duration-300">
                🎟 Book Now
              </button>
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}