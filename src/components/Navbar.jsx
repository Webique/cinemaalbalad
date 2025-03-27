import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-lg shadow-lg">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 h-28 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4 overflow-hidden">
          <Link to="/">
            <img
              src={logo}
              alt="Cinema Al Balad"
              className="h-24 w-auto object-contain"
              style={{ maxHeight: "96px" }}
            />
          </Link>
          <span className="text-white text-3xl font-cinema tracking-wide hidden sm:block">
            Cinema Al Balad
          </span>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-10 text-white font-cinema text-lg">
          <Link to="/" className="hover:text-primary transition duration-300">Home</Link>
          <Link to="/movies" className="hover:text-primary transition duration-300">Movies</Link>
          <Link to="/book" className="hover:text-primary transition duration-300">Book Now</Link>
          <Link to="/contact" className="hover:text-primary transition duration-300">Contact</Link>
        </nav>

        {/* Hamburger Icon */}
        <div className="md:hidden z-50 pl-4 pr-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-9 h-9 focus:outline-none"
          >
            <span className={`absolute h-0.5 w-9 bg-white rounded transform transition duration-300 ease-in-out ${isOpen ? "rotate-45 top-4" : "top-1"}`} />
            <span className={`absolute h-0.5 w-9 bg-white rounded transition-all duration-300 ease-in-out ${isOpen ? "opacity-0" : "top-4"}`} />
            <span className={`absolute h-0.5 w-9 bg-white rounded transform transition duration-300 ease-in-out ${isOpen ? "-rotate-45 top-4" : "top-7"}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            key="mobile-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="md:hidden absolute top-28 left-0 w-full bg-black/90 text-white py-6 px-8 flex flex-col gap-5 font-cinema text-xl backdrop-blur-md shadow-xl"
          >
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/movies" onClick={() => setIsOpen(false)}>Movies</Link>
            <Link to="/book" onClick={() => setIsOpen(false)}>Book Now</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
