import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { CalendarDays, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Events() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  // Event list (commented out due to cancellation)
  const events = [
    {
      id: 1,
      title: isArabic ? "ليالي مفلِم" : "Maflam Nights",
      date: isArabic ? "٢١ مايو" : "21 May",
      time: "8:00 PM",
      description: isArabic
        ? "حكاية مخرج من البلد مع المخرج عبدالله سحرتي. رحلة إبداعية من عدسة الإعلان إلى قلب سينما البلد. إدارة الحوار: رهام فراش."
        : "A Filmmaker’s Tale from Al-Balad with Director Abdullah Saharti. A creative journey from the lens of advertising to the heart of Cinema Al Balad. Moderated by Reham Farrash.",
      image: "/posters/21may.jpeg", // Update the image path here
    },

    {
      id: 2,
      title: isArabic ? "كيف نقرأ الأفلام" : "How to Read Films",
      date: isArabic ? "١٨ مايو" : "18 May",
      time: "7:30 PM",
      description: isArabic
        ? "تقدمها عهود الحربي - صانعة أفلام، مهتمة بالنقد الأدبي والسينمائي. دليلك لتحليل الفيلم أثناء مشاهدته ضمن فعالية قعدات فنية."
        : "Led by Ohoud Alharbi – Filmmaker with a focus on literary and film criticism. Your guide to interpreting films while watching, part of the Filmmakers Gathering at Cinema Al Balad.",
      image: "/posters/event1.jpeg",
    }
  ];

  return (
    <>
      <Navbar />
      <main
        dir={isArabic ? "rtl" : "ltr"}
        className={`relative text-white font-cinema pt-36 pb-40 min-h-screen ${
          isArabic ? "text-right" : "text-left"
        }`}
        style={{
          backgroundImage: "url('/main.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

        <div className="relative z-10">
          {/* Header */}
          <motion.div
            className="text-center px-6 sm:px-10 lg:px-20 mb-24"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl font-cinema mb-4 drop-shadow-md">
              {t('events.title')}
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto drop-shadow">
              {t('events.subtitle')}
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative max-w-6xl mx-auto px-6 sm:px-10 lg:px-20 space-y-32">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-1 bg-white/10 z-0" />

            {events.map((event, index) => (
              <motion.div
                key={event.id}
                className={`relative z-10 flex flex-col md:flex-row items-center gap-12 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: index * 0.1 }}
              >
                {/* Image */}
                <div className="w-full md:w-1/2">
                  <div className="w-full inline-block space-y-2">
                    <div className="bg-primary text-white text-sm px-4 py-1 rounded-full shadow-md inline-block">
                      {event.date}
                    </div>
                    <div className="w-full rounded-2xl shadow-2xl bg-black inline-block overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-auto object-contain rounded-2xl shadow-2xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
                  <h2 className="text-3xl sm:text-4xl font-semibold drop-shadow-lg">
                    {event.title}
                  </h2>
                  <p className="text-gray-200 text-md sm:text-lg leading-relaxed drop-shadow-sm">
                    {event.description}
                  </p>
                  <div
                    className={`flex ${
                      isArabic ? "justify-end md:justify-end" : "justify-center md:justify-start"
                    } gap-4 text-gray-300 text-sm mt-2`}
                  >
                    <div className="flex items-center gap-1">
                      <Clock size={16} /> {event.time}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
