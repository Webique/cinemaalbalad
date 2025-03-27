// src/components/MovieCard.jsx
import { motion } from "framer-motion";

export default function MovieCard({ movie }) {
  return (
    <motion.div
      className="bg-black/90 border border-white/10 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-transform duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-72 object-cover transform hover:scale-105 transition duration-500 ease-in-out"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-cinema text-white mb-1">{movie.title}</h3>
        <div className="text-sm text-gray-300 mb-2">
          {movie.runtime} • {movie.rating}
        </div>
        <p className="text-sm text-gray-400">{movie.synopsis}</p>
      </div>
    </motion.div>
  );
}
