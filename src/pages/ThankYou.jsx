import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next"; // ✅ NEW

export default function ThankYou() {
  const { t } = useTranslation(); // ✅ NEW

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen text-white font-cinema overflow-hidden pt-36 px-6 sm:px-10 lg:px-20 pb-32 flex items-center justify-center">
        {/* Blurred Background */}
        <div className="fixed top-0 left-0 w-full h-full -z-10">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url('/main.png')" }}
          >
            <div className="w-full h-full bg-black/50 backdrop-blur-sm" />
          </div>
        </div>

        {/* Content */}
        <section className="relative z-10 max-w-3xl w-full text-center space-y-12 bg-black/30 backdrop-blur-md rounded-2xl p-10 shadow-xl">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex justify-center"
          >
            <CheckCircleIcon className="w-24 h-24 text-green-400 drop-shadow-xl animate-pulse" />
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl tracking-wide leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          >
            {t('thankyou.title')}
          </motion.h1>

          <motion.p
            className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          >
            {t('thankyou.subtitle')}
          </motion.p>

          <motion.div
            className="flex justify-center gap-6 flex-wrap mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
          >
            <Link
              to="/"
              className="bg-primary hover:bg-primary/80 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-md hover:scale-105"
            >
              ⬅ {t('thankyou.backHome')}
            </Link>
            <Link
              to="/movies"
              className="bg-white hover:bg-gray-200 text-black px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-md hover:scale-105"
            >
              🎬 {t('thankyou.browseMovies')}
            </Link>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
