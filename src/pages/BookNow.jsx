import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import movies from "../data/movies";

export default function BookNow() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    tickets: 0,
  });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const movieId = Number(searchParams.get("movieId"));
  const prefilledTime = searchParams.get("time");
  const prefilledCount = Number(searchParams.get("count"));
  const selectedMovie = movies.find((m) => m.id === movieId);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const times = ["6:00 PM", "9:00 PM"];
  const seats = Array.from({ length: 30 }, (_, i) => i + 1);
  const ticketPrice = 35;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) => {
      const updatedSeats = prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat];
      return updatedSeats;
    });
  };

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      time: prefilledTime || "",
      tickets: prefilledCount || 0,
    }));
    setSelectedSeats(Array.from({ length: prefilledCount || 0 }, (_, i) => i + 1));
  }, [prefilledTime, prefilledCount]);

  useEffect(() => {
    setForm((prev) => ({ ...prev, tickets: selectedSeats.length }));
  }, [selectedSeats]);



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!form.name || !form.email || !form.date || !form.time || selectedSeats.length === 0) {
      alert("Please fill all fields and select seats.");
      return;
    }
  
    const payload = {
      name: form.name,
      email: form.email,
      movie: selectedMovie.title,
      time: form.time,
      date: form.date,
      seats: selectedSeats,
    };
  
    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
      alert(data.message); // ✅ Show success message
      navigate("/"); // redirect to homepage (or change if needed)
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit booking");
    }
  };
  


  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-b from-secondary via-black to-secondary text-white font-cinema pt-36 min-h-screen px-6 sm:px-10 lg:px-20 pb-32">
        {!selectedMovie ? (
          <motion.section
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl mb-6">Choose a Movie First 🎬</h1>
            <p className="text-gray-300 text-lg mb-8">
              Please select a movie before accessing the booking screen.
            </p>
            <Link
              to="/movies"
              className="inline-block bg-primary text-white px-8 py-4 rounded-full text-lg shadow-md hover:scale-105 transition duration-300"
            >
              Browse Movies
            </Link>
          </motion.section>
        ) : (
          <>
            <motion.section
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl sm:text-5xl mb-6">Book Your Seat</h1>
              <p className="text-gray-300 text-lg mb-12">
                Choose your showtime and reserve your ticket at Cinema Al Balad.
              </p>

              <motion.form
                className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left bg-white/5 p-8 rounded-xl backdrop-blur-md shadow-xl mb-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="text-center mb-10 col-span-2">
                  <h2 className="text-3xl font-cinema mb-2">{selectedMovie.title}</h2>
                  <p className="text-gray-400">{selectedMovie.runtime} • {selectedMovie.rating}</p>
                  <img
                    src={selectedMovie.poster}
                    alt={selectedMovie.title}
                    className="w-40 mx-auto mt-4 rounded-xl shadow-md"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Time</label>
                  <select
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select</option>
                    {times.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Tickets</label>
                  <input
                    type="number"
                    name="tickets"
                    value={form.tickets}
                    readOnly
                    className="w-full px-4 py-3 rounded bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary cursor-not-allowed"
                  />
                </div>

                <div className="col-span-2 text-center">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="mt-8 bg-primary hover:bg-opacity-80 px-8 py-4 rounded-full text-white text-lg shadow-md hover:scale-105 transition transform duration-300"
                  >
                    🎟 Reserve Now
                  </button>
                </div>
              </motion.form>
            </motion.section>

            {/* Seating Grid */}
            <motion.section
              className="max-w-4xl mx-auto mt-24 text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl sm:text-3xl mb-4">Select Your Seat</h2>
              <p className="text-gray-400 mb-8">Tap to reserve a seat. Max 10 per booking.</p>
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl shadow-xl">
                <p className="text-sm uppercase text-gray-400 mb-4">Screen This Way</p>
                <div className="h-2 w-full bg-primary rounded mb-10"></div>
                <div className="grid grid-cols-6 gap-4 justify-center">
                  {seats.map((seat) => (
                    <button
                      key={seat}
                      onClick={() => toggleSeat(seat)}
                      disabled={selectedSeats.length >= 10 && !selectedSeats.includes(seat)}
                      className={`w-10 h-10 rounded-lg text-sm font-semibold transition duration-300
                        ${selectedSeats.includes(seat)
                          ? "bg-primary text-white"
                          : "bg-white/10 text-white hover:bg-primary/60"}
                        ${selectedSeats.length >= 10 && !selectedSeats.includes(seat)
                          ? "opacity-30 cursor-not-allowed"
                          : ""}`}
                    >
                      {seat}
                    </button>
                  ))}
                </div>

                {/* Summary Box */}
                <div className="mt-10 text-left sm:text-center">
                  <h3 className="text-xl font-semibold mb-2 text-white">Booking Summary</h3>
                  <p className="text-gray-300 text-sm mb-1">Selected Seats: {selectedSeats.join(", ") || "None"}</p>
                  <p className="text-gray-300 text-sm mb-1">Total Tickets: {form.tickets}</p>
                  <p className="text-gray-300 text-sm">Total Price: {form.tickets * ticketPrice} SAR</p>
                </div>
              </div>
            </motion.section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}