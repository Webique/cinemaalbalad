import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <>
      <Navbar />
      <main
        dir={isArabic ? "rtl" : "ltr"}
        className={`relative min-h-screen font-cinema pt-40 pb-32 px-6 sm:px-10 lg:px-28 ${
          isArabic ? "text-right" : "text-left"
        }`}
        style={{
          backgroundImage: "url('/main.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-0" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto space-y-16 text-white">
          <motion.h1
            className="text-4xl sm:text-5xl text-center tracking-wide drop-shadow-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t("about.title")}
          </motion.h1>

          {[...Array(6)].map((_, index) => (
            <motion.p
              key={index}
              className="text-lg sm:text-xl leading-relaxed text-gray-200 drop-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {t(`about.paragraph${index + 1}`)}
            </motion.p>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
