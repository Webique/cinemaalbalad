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

  const seats = Array.from({ length: 30 }, (_, i) => i + 1);

  const seatLabel = (seat) => {
    const row = String.fromCharCode(65 + Math.floor((seat - 1) / 6)); // A, B, C, D, E
    const number = ((seat - 1) % 6) + 1; // 1 to 6
    return `${row}${number}`;
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`https://cinemaalbalad.onrender.com/api/movies/${movieId}`);
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

    const matchingShow = selectedMovie.showtimes.find((s) => s.time === prefilledTime);

    if (matchingShow) {
      setForm((prev) => ({
        ...prev,
        time: prefilledTime,
        date: matchingShow.date,
        tickets: 0,
      }));
      setSelectedSeats([]);
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
          `https://cinemaalbalad.onrender.com/api/bookings/taken-seats?movie=${selectedMovie.title}&date=${form.date}&time=${form.time}`
        );
        const data = await res.json();
        setTakenSeats(data.takenSeats || []);
      } catch (err) {
        console.error("Error fetching taken seats:", err);
      }
    };

    fetchTakenSeats();
  }, [selectedMovie, form.date, form.time]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.date || !form.time || selectedSeats.length === 0 || !selectedMovie) {
      alert("Please fill all fields and choose a movie.");
      return;
    }

    const bookingDetails = {
      name: form.name,
      email: form.email,
      movie: selectedMovie.title,
      time: form.time,
      date: form.date,
      seats: selectedSeats,
      price: selectedSeats.length * ticketPrice,
    };

    const queryString = encodeURIComponent(JSON.stringify(bookingDetails));
    navigate(`/payment?details=${queryString}`);
  };

  if (!selectedMovie) {
    return (
      <>
        <Navbar />
        <main className="relative min-h-screen text-white font-cinema overflow-hidden pt-36 text-center">
          {/* Blurred Background */}
          <div className="fixed top-0 left-0 w-full h-full -z-10">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: "url('/main.png')" }}
            >
              <div className="w-full h-full bg-black/50 backdrop-blur-sm" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">Loading Movie...</h1>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen text-white font-cinema overflow-hidden pt-36 px-6 sm:px-10 lg:px-20 pb-32">
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
        <motion.section className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl mb-6 font-bold">Book Your Seat</h1>
          <p className="text-gray-300 text-lg mb-12">
            Movie: <strong className="text-primary">{selectedMovie.title}</strong>
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-black/30 backdrop-blur-md p-6 rounded-xl shadow-lg text-white"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="px-4 py-3 rounded bg-white/90 text-black border border-gray-300"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="px-4 py-3 rounded bg-white/90 text-black border border-gray-300"
              />
            </div>

            <div className="mt-8">
              <h3 className="text-lg mb-4 font-semibold">Select Seats (Max 10)</h3>
              <div className="bg-black/20 rounded-lg py-4 px-4 mb-6">
                <div className="text-center text-gray-400 font-medium mb-4">SCREEN</div>

                {/* Responsive seat grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4 justify-center">
                  {seats.map((seat) => (
                    <button
                      key={seat}
                      type="button"
                      onClick={() => toggleSeat(seat)}
                      disabled={
                        takenSeats.includes(seat) ||
                        (selectedSeats.length >= 10 && !selectedSeats.includes(seat))
                      }
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center
                      ${
                        takenSeats.includes(seat)
                          ? "bg-red-900 text-white"
                          : selectedSeats.includes(seat)
                          ? "bg-red-600 text-white"
                          : "bg-gray-300 text-black hover:bg-red-100"
                      }`}
                    >
                      {seatLabel(seat)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 text-left sm:text-center text-white">
              <p className="text-sm">Selected: {selectedSeats.map(seatLabel).join(", ") || "None"}</p>
              <p className="text-sm">Total Tickets: {selectedSeats.length}</p>
              <p className="text-sm">Total Price: {selectedSeats.length * ticketPrice} SAR</p>
            </div>

            <div className="mt-8 text-center">
              <button
                type="submit"
                className="bg-primary hover:bg-primary/80 px-8 py-3 rounded-full text-white text-lg transition duration-300"
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
