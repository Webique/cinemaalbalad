import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Events() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  // ✅ Converts Arabic numerals to English
  const arabicToEnglishNumber = (str) =>
    str.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));

  // ✅ Translates Arabic month names to English
  const translateArabicMonth = (month) => {
    const map = {
      "يناير": "January",
      "فبراير": "February",
      "مارس": "March",
      "أبريل": "April",
      "مايو": "May",
      "يونيو": "June",
      "يوليو": "July",
      "أغسطس": "August",
      "سبتمبر": "September",
      "أكتوبر": "October",
      "نوفمبر": "November",
      "ديسمبر": "December"
    };
    return map[month] || month;
  };

  // ✅ Parses date string to ISO format
  const parseEventDateToISO = (dateStr) => {
    let [day, month] = dateStr.split(" ");

    if (/[٠-٩]/.test(day)) {
      day = arabicToEnglishNumber(day);
    }

    month = translateArabicMonth(month);

    const fullDateStr = `${day} ${month} 2025`;
    const date = new Date(fullDateStr);
    return date.toISOString().split("T")[0];
  };

  const handleBookNow = (event) => {
    navigate(`/movies?date=${event.navigateToDate}`);
  };
  
  

  const events = [

    {
      id: 3,
      title: isArabic
        ? "مباراة العيد - تصفيات كأس العالم ٢٠٢٦"
        : "Eid Nights Match – 2026 FIFA World Cup Qualification",
      date: isArabic ? "١٠ يونيو" : "10 June",
      time: "9:00 PM",
      description: isArabic
        ? "تصفيات كأس العالم ٢٠٢٦: السعودية ضد أستراليا. تابعوا المباراة مباشرة في سينما البلد."
        : "2026 FIFA World Cup Qualification: Saudi Arabia vs Australia. Watch the match live at Cinema Al Balad.",
      image: "/posters/june10.jpeg", // Make sure this matches your file name
      navigateToDate: "2025-06-10",
    },
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

                  <div
                    className={`flex ${
                      isArabic ? "justify-end" : "justify-start"
                    } mt-4`}
                  >
<button
  onClick={() => handleBookNow(event)}
  className="px-6 py-2 bg-primary text-white rounded-full hover:scale-105 transition font-cinema"
>
  🎟 {isArabic ? "احجز الآن" : "Book Now"}
</button>

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
