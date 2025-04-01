import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function AdminPanel() {
  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-b from-secondary via-black to-secondary text-white font-cinema pt-40 min-h-screen px-6 sm:px-10 lg:px-20 pb-32">
        <motion.h1
          className="text-4xl sm:text-5xl font-cinema text-center mb-16 tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          🎬 Admin Dashboard
        </motion.h1>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { label: "Total Bookings", value: "1,245" },
            { label: "Total Movies", value: "37" },
            { label: "Revenue", value: "SAR 43,200" },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-lg backdrop-blur-md text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <p className="text-sm text-gray-400 uppercase mb-2">{card.label}</p>
              <h3 className="text-3xl font-bold text-white">{card.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Bookings Table */}
        <div className="mb-20">
          <h2 className="text-2xl font-semibold mb-6">Latest Bookings</h2>
          <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-xl shadow-lg">
            <table className="w-full table-auto text-sm text-left">
              <thead className="bg-white/10 text-gray-300">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Movie</th>
                  <th className="p-4">Time</th>
                  <th className="p-4">Tickets</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Sara Alghamdi", movie: "Hajjan", time: "6:00 PM", tickets: 2 },
                  { name: "Faisal B.", movie: "Scales", time: "9:00 PM", tickets: 1 },
                  { name: "Noura K.", movie: "Theeb", time: "6:00 PM", tickets: 3 },
                ].map((row, idx) => (
                  <tr key={idx} className="border-t border-white/10 hover:bg-white/10 transition">
                    <td className="p-4">{row.name}</td>
                    <td className="p-4">{row.movie}</td>
                    <td className="p-4">{row.time}</td>
                    <td className="p-4">{row.tickets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Movie Management */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Movie Management</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Hajjan",
              "Scales",
              "Born a King",
              "Wadjda",
              "Champions",
              "Theeb",
            ].map((movie, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 p-4 rounded-xl text-white hover:shadow-xl transition"
              >
                <p className="text-lg">{movie}</p>
                <button className="mt-2 text-sm text-primary hover:underline">Edit</button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
