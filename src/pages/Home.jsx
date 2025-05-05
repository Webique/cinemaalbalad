import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeroVideo from "../components/HeroVideo";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { Film } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <>
      <Navbar />
      <main
        dir={isArabic ? "rtl" : "ltr"}
        className={`relative min-h-screen text-white font-cinema overflow-hidden ${isArabic ? "text-right" : "text-left"}`}
      >
        {/* Blurred Background Layer */}
        <div className="fixed top-0 left-0 w-full h-full -z-10">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('/main.png')"
            }}
          >
            <div className="w-full h-full bg-black/50 backdrop-blur-sm" />
          </div>
        </div>

        {/* Page Content */}
        <div className="relative z-10">
          <HeroVideo />

          {/* Main Section */}
          <section className="py-24 px-6 sm:px-10 lg:px-20">
            <motion.div
              className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              <div className={`space-y-6 max-w-xl ${isArabic ? "text-right md:text-right" : "text-center md:text-left"}`}>
                <h2 className="text-4xl sm:text-5xl font-cinema leading-tight drop-shadow-lg">
                  {t('home.discover')}
                </h2>
                <p className="text-gray-300 text-lg">
                  {t('home.explore')}
                </p>
                <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    to="/movies"
                    className="inline-block mt-4 bg-primary text-white font-cinema text-lg px-8 py-4 rounded-full shadow-md hover:shadow-xl transition duration-300"
                  >
                    🎥 {t('home.browseMovies')}
                  </Link>
                </motion.div>
              </div>

              <motion.div
                className="text-primary"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                <Film size={140} className="mx-auto animate-pulse-slow" />
              </motion.div>
            </motion.div>
          </section>

          {/* Showtime Info */}
          <section className="py-24 px-6 sm:px-10 lg:px-20 text-white text-center">
            <motion.h2
              className="text-5xl font-cinema mb-16 tracking-wider drop-shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {t('home.showtimeTitle')}
            </motion.h2>

            <motion.div
              className="space-y-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
            >
              <div>
                <p className="uppercase text-sm tracking-widest text-gray-300 mb-2">
                  {t('home.ticketPrice')}
                </p>
                <h3 className="text-4xl sm:text-5xl font-bold text-white drop-shadow flex items-center justify-center gap-3">
                  35
                  <img
                    src="/saudi-riyal.png"
                    alt="SAR"
                    className="w-9 h-9 sm:w-11 sm:h-11 inline-block"
                  />
                </h3>


                <p className="text-gray-400 text-sm mt-2">{t('home.perPerson')}</p>
              </div>

              <div>
                <p className="uppercase text-sm tracking-widest text-gray-300 mb-4">
                  {t('home.dailyShowtimes')}
                </p>
                <div className="flex justify-center gap-6 flex-wrap">
                  <span className="text-xl sm:text-2xl font-cinema text-primary glow-sm">
                    🎬 6:00 PM
                  </span>
                  <span className="text-xl sm:text-2xl font-cinema text-primary glow-sm">
                    🌙 9:00 PM
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-3">{t('home.openingHours')}</p>
              </div>
            </motion.div>
          </section>

          {/* Footer */}
          <Footer />
        </div>
      </main>
    </>
  );
}
