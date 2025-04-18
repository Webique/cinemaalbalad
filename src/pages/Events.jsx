import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { CalendarDays, Clock } from "lucide-react";

const events = [
  {
    id: 1,
    title: "✨ Saudi Film Night",
    date: "April 12, 2025",
    time: "8:30 PM",
    description:
      "A celebration of short films by emerging Saudi filmmakers, followed by live discussions with directors.",
    image: "/events/saudi-film-night.jpg",
  },
  {
    id: 2,
    title: "🎬 Classic Egyptian Cinema",
    date: "April 19, 2025",
    time: "9:00 PM",
    description:
      "Relive iconic moments in Egyptian cinema with legends like Adel Imam. Plus, a retro red carpet photo moment.",
    image: "/events/egyptian-classics.jpg",
  },
  {
    id: 3,
    title: "🎥 Documentary Weekend",
    date: "April 26–27, 2025",
    time: "6:00 PM",
    description:
      "Two nights. Two worlds. Dive into award-winning documentaries tackling identity, art, and change.",
    image: "/events/documentary-weekend.jpg",
  },
];

export default function Events() {
  return (
    <>
      <Navbar />
      <main
        className="relative text-white font-cinema pt-36 pb-40 min-h-screen"
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
              Upcoming Events
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto drop-shadow">
              Step into unforgettable nights of cinema, culture, and connection in Jeddah’s Historic District.
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
                  <div className="relative group rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="object-cover w-full h-[320px] sm:h-[380px] transform group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-black/40 group-hover:bg-black/60 transition duration-500" />
                    <div className="absolute top-6 left-6 bg-primary text-white text-sm px-4 py-1 rounded-full shadow-lg">
                      {event.date}
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
                  <div className="flex justify-center md:justify-start gap-4 text-gray-300 text-sm mt-2">
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
