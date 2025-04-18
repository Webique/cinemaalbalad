import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function About() {
  return (
    <>
      <Navbar />
      <main
        className="relative min-h-screen font-cinema pt-40 pb-32 px-6 sm:px-10 lg:px-28"
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
            About Cinema Al Balad
          </motion.h1>

          {[
            "Cinema Al Balad is inspired by Al-Jumjum Cinema, the first open-air cinema in Saudi Arabia. This pioneering space laid the foundation for outdoor film screenings across the historic neighborhoods of Jeddah, where tickets were just 10 SAR and showtimes began at 7:00 PM and 9:00 PM.",
            "Under the name Fouad Jumjum Studios, Jumjum produced and distributed over 30 cinematic titles, hosting some of the most iconic stars of Egyptian cinema — including Adel Imam, Mahmoud Yassin, Hussein Fahmy, and Farid Shawqi — and frequently invited them to Jeddah for local screenings and cultural exchanges.",
            "Cinema Al Balad continues that legacy, showcasing a rich mix of Saudi films, classic cinema, and global masterpieces. We aim to highlight local talent by curating a calendar filled with short films, features, and documentaries from both emerging and established Saudi filmmakers.",
            "We're building partnerships with major regional film festivals, such as the Saudi Film Festival, as a first step toward hosting Arab and international premieres. These screenings will invite directors, actors, and producers to engage directly with audiences and foster deeper cultural dialogue.",
            "Beyond screenings, Cinema Al Balad will offer a series of cinema workshops and creative panels, featuring acclaimed directors, actors, cinematographers, screenwriters, composers, editors, and more — drawn from both local and global industries.",
            "Our vision is for Cinema Al Balad to be more than just a venue — it’s a vibrant gathering space where artists and film lovers can share their work, exchange ideas, and bring powerful stories to life.",
          ].map((text, index) => (
            <motion.p
              key={index}
              className="text-lg sm:text-xl leading-relaxed text-gray-200 drop-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {text}
            </motion.p>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
