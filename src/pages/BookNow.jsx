import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function BookNow() {
  const [form, setForm] = useState({ name: "", email: "", date: "", time: "", tickets: 0 });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const movieId = searchParams.get("movieId");
  const prefilledTime = searchParams.get("time");
  const prefilledCount = Number(searchParams.get("count"));

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [takenSeats, setTakenSeats] = useState([]);
  const ticketPrice = 35;
  const times = ["6:00 PM", "9:00 PM"];
  const seats = Array.from({ length: 30 }, (_, i) => i + 1);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/movies/${movieId}`);
        const data = await res.json();
        if (data && data.title) {
          setSelectedMovie(data);
        } else {
          console.error("Invalid movie data", data);
        }
      } catch (err) {
        console.error("Failed to fetch movie:", err);
      }
    };
    if (movieId) fetchMovie();
  }, [movieId]);

  useEffect(() => {
    if (!selectedMovie || !prefilledTime) return;
  
    const matchingShow = selectedMovie.showtimes.find(
      (s) => s.time === prefilledTime
    );
  
    if (matchingShow) {
      setForm((prev) => ({
        ...prev,
        time: prefilledTime,
        date: matchingShow.date,
        tickets: 0, // ✅ no tickets selected initially
      }));
      setSelectedSeats([]); // ✅ don't preselect seats
    }
  }, [selectedMovie, prefilledTime]);
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  useEffect(() => {
    const fetchTakenSeats = async () => {
      if (!selectedMovie || !form.date || !form.time) return;
  
      try {
        const res = await fetch(
          `http://localhost:5000/api/bookings/taken-seats?movie=${selectedMovie.title}&date=${form.date}&time=${form.time}`
        );
        const data = await res.json();
        setTakenSeats(data.takenSeats || []);
      } catch (err) {
        console.error("Error fetching taken seats:", err);
      }
    };
  
    fetchTakenSeats();
  }, [selectedMovie, form.date, form.time]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.date ||
      !form.time ||
      selectedSeats.length === 0 ||
      !selectedMovie
    ) {
      alert("Please fill all fields and choose a movie.");
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("✅ Booking submitted:", data);
      navigate(
        `/payment?movieId=${movieId}&time=${form.time}&count=${selectedSeats.length}`
      );
      


    } catch (err) {
      console.error("❌ Failed to submit booking:", err);
      alert("❌ Failed to submit booking");
    }
  };

  if (!selectedMovie) {
    return (
      <>
        <Navbar />
        <main className="pt-36 text-center text-white">
          <h1 className="text-4xl font-bold">Loading Movie...</h1>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-b from-secondary via-black to-secondary text-white font-cinema pt-36 min-h-screen px-6 sm:px-10 lg:px-20 pb-32">
        <motion.section className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl mb-6">Book Your Seat</h1>
          <p className="text-gray-300 text-lg mb-12">Movie: <strong>{selectedMovie.title}</strong></p>

          <form onSubmit={handleSubmit} className="bg-white/5 p-6 rounded-xl backdrop-blur-md shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="px-4 py-3 rounded bg-white/10 border border-white/10 text-white"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="px-4 py-3 rounded bg-white/10 border border-white/10 text-white"
              />


            </div>

            <div className="mt-8">
              <h3 className="text-lg mb-4">Select Seats (Max 10)</h3>
              <div className="grid grid-cols-6 gap-4 justify-center">
                {seats.map((seat) => (
                  <button
                    key={seat}
                    type="button"
                    onClick={() => toggleSeat(seat)}
                    disabled={
                      takenSeats.includes(seat) ||
                      (selectedSeats.length >= 10 && !selectedSeats.includes(seat))
                    }
                    className={`w-10 h-10 rounded-lg text-sm transition duration-300
                      ${takenSeats.includes(seat)
                        ? "bg-red-500 text-white"
                        : selectedSeats.includes(seat)
                        ? "bg-primary text-white"
                        : "bg-white/10 text-white hover:bg-primary/80"}`}
                  >
                    {seat}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 text-left sm:text-center">
              <p className="text-gray-300 text-sm">Selected: {selectedSeats.join(", ") || "None"}</p>
              <p className="text-gray-300 text-sm">Total Tickets: {selectedSeats.length}</p>
              <p className="text-gray-300 text-sm">Total Price: {selectedSeats.length * ticketPrice} SAR</p>
            </div>

            <div className="mt-8 text-center">
              <button
                type="submit"
                className="bg-primary px-8 py-3 rounded-full text-white text-lg hover:scale-105 transition duration-300"
              >
                🎟 Reserve Now
              </button>
            </div>
          </form>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}
