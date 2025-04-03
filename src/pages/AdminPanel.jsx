import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function AdminPanel() {
  const [stats, setStats] = useState({ totalBookings: 0, totalUsers: 0, totalRevenue: 0 });
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch stats
    fetch("http://localhost:5000/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Stats error:", err));

    // Fetch all bookings
    fetch("http://localhost:5000/api/admin/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error("Bookings error:", err));
  }, []);

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
            { label: "Total Bookings", value: stats.totalBookings },
            { label: "Total Users", value: stats.totalUsers },
            { label: "Revenue", value: `SAR ${stats.totalRevenue}` },
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
                  <th className="p-4">Date</th>
                  <th className="p-4">Seats</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((row, idx) => (
                  <tr key={idx} className="border-t border-white/10 hover:bg-white/10 transition">
                    <td className="p-4">{row.name}</td>
                    <td className="p-4">{row.movie}</td>
                    <td className="p-4">{row.time}</td>
                    <td className="p-4">{row.date}</td>
                    <td className="p-4">{row.seats.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
