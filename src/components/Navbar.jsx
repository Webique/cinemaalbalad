import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState(i18n.language.toUpperCase() || "EN");
  const location = useLocation();
  const { t, i18n: i18next } = useTranslation();
  const isArabic = i18next.language === "ar";

  const handleClose = () => setIsOpen(false);

  const navLinks = [
    { name: t("navbar.home"), path: "/" },
    { name: t("navbar.movies"), path: "/movies" },
    { name: t("navbar.events"), path: "/events" },
    { name: t("navbar.about"), path: "/about" },
  ];

  const toggleLanguage = () => {
    const newLang = language === "EN" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    setLanguage(newLang.toUpperCase());
  };

  return (
    <header
      className="fixed top-0 w-full z-50 bg-white shadow-md"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div
        className={`max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 h-32 flex items-center justify-between gap-6 ${
          isArabic ? "flex-row-reverse" : ""
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-6 overflow-hidden">
          <Link to="/">
            <img
              src={logo}
              alt={t("navbar.logoAlt")}
              className="h-28 w-auto object-contain"
              style={{ maxHeight: "112px" }}
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav
          className={`hidden md:flex items-center font-cinema text-lg flex-1 justify-center ${
            isArabic ? "space-x-reverse space-x-10" : "space-x-10"
          }`}
        >
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

        {/* Language + Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-black font-cinema text-lg border border-black px-3 py-1 rounded hover:bg-primary hover:text-white transition"
          >
            <Globe className="w-5 h-5" />
            {language}
          </button>

          {/* Hamburger */}
          <div className="md:hidden pr-4">
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

            <button
              onClick={toggleLanguage}
              className="mt-4 flex items-center gap-2 text-black font-cinema text-lg border border-black px-3 py-1 rounded hover:bg-primary hover:text-white transition self-start"
            >
              <Globe className="w-5 h-5" />
              {language}
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
