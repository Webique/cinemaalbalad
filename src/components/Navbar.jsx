import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const handleClose = () => setIsOpen(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "Events", path: "/events" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 h-32 flex items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-6 overflow-hidden">
          <Link to="/">
            <img
              src={logo}
              alt="Cinema Al Balad"
              className="h-28 w-auto object-contain"
              style={{ maxHeight: "112px" }}
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-10 text-black font-cinema text-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`hover:text-primary transition duration-300 ${
                location.pathname === link.path ? "text-primary" : "text-black"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden z-50 pl-4 pr-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-9 h-9 focus:outline-none"
          >
            <span
              className={`absolute h-0.5 w-9 bg-black rounded transform transition duration-300 ease-in-out ${
                isOpen ? "rotate-45 top-4" : "top-1"
              }`}
            />
            <span
              className={`absolute h-0.5 w-9 bg-black rounded transition-all duration-300 ease-in-out ${
                isOpen ? "opacity-0" : "top-4"
              }`}
            />
            <span
              className={`absolute h-0.5 w-9 bg-black rounded transform transition duration-300 ease-in-out ${
                isOpen ? "-rotate-45 top-4" : "top-7"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            key="mobile-nav"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="md:hidden absolute top-28 left-0 w-full bg-white text-black py-6 px-8 flex flex-col gap-5 font-cinema text-xl shadow-md"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={handleClose}
                className={`hover:text-primary transition duration-300 ${
                  location.pathname === link.path ? "text-primary" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
