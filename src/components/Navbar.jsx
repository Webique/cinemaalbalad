import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();

  const handleClose = () => setIsOpen(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "Events", path: "/events" },
    { name: "Book", path: "/book" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-lg shadow-lg">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 h-32 flex items-center justify-between gap-6">
        {/* Logo & Title */}
        <div className="flex items-center gap-6 overflow-hidden">
          <Link to="/">
            <img
              src={logo}
              alt="Cinema Al Balad"
              className="h-28 w-auto object-contain"
              style={{ maxHeight: "112px" }}
            />
          </Link>
          <span className="text-white text-3xl font-cinema tracking-wide hidden sm:block">
            Cinema Al Balad
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-10 text-white font-cinema text-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`hover:text-primary transition duration-300 ${
                location.pathname === link.path ? "text-primary" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="text-white hover:text-primary transition duration-300"
            >
              <UserCircleIcon className="w-8 h-8" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-3 w-40 bg-white rounded-md shadow-lg z-50 text-sm text-black font-medium">
                <Link
                  to="/login"
                  onClick={() => setShowProfile(false)}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setShowProfile(false)}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Hamburger for Mobile */}
        <div className="md:hidden z-50 pl-4 pr-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-9 h-9 focus:outline-none"
          >
            <span
              className={`absolute h-0.5 w-9 bg-white rounded transform transition duration-300 ease-in-out ${
                isOpen ? "rotate-45 top-4" : "top-1"
              }`}
            />
            <span
              className={`absolute h-0.5 w-9 bg-white rounded transition-all duration-300 ease-in-out ${
                isOpen ? "opacity-0" : "top-4"
              }`}
            />
            <span
              className={`absolute h-0.5 w-9 bg-white rounded transform transition duration-300 ease-in-out ${
                isOpen ? "-rotate-45 top-4" : "top-7"
              }`}
            />
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

      {/* Mobile Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowProfile((prev) => !prev)}
          className="flex items-center gap-2 text-white hover:text-primary transition duration-300"
        >
          <UserCircleIcon className="w-7 h-7" />
          <span>Profile</span>
        </button>

        {showProfile && (
          <div className="mt-4 ml-1 bg-white rounded-md shadow-lg text-black font-medium text-base">
            <Link
              to="/login"
              onClick={() => {
                setShowProfile(false);
                handleClose();
              }}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              onClick={() => {
                setShowProfile(false);
                handleClose();
              }}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </motion.nav>
  )}
</AnimatePresence>

    </header>
  );
}
