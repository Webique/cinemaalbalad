import { useState, useEffect } from "react";

export default function ScanPage() {
  const [bookingId, setBookingId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showtimes, setShowtimes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [freeName, setFreeName] = useState("");
  const [selectedFreeSeat, setSelectedFreeSeat] = useState(null);
  const [takenSeats, setTakenSeats] = useState([]);
  const [totalSeats, setTotalSeats] = useState(48); // default

  const seatLabel = (seat) => {
    const row = String.fromCharCode(65 + Math.floor((seat - 1) / 8));
    const number = ((seat - 1) % 8) + 1;
    return `${row}${number}`;
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(`https://cinemaalbalad.onrender.com/api/bookings/by-showtime?movie=${encodeURIComponent(selectedMovie)}&date=${selectedDate}&time=${selectedTime}`);
      const data = await res.json();
      setBookings(data);
    } catch {
      console.error("Failed to load bookings");
    }
  };

  const fetchTakenSeats = async () => {
    try {
      const res = await fetch(`https://cinemaalbalad.onrender.com/api/bookings/taken-seats?movie=${selectedMovie}&date=${selectedDate}&time=${selectedTime}`);
      const data = await res.json();
      setTakenSeats(data.takenSeats || []);
    } catch {
      console.error("Error fetching taken seats");
    }
  };

  const markAsScanned = async (id) => {
    try {
      await fetch("https://cinemaalbalad.onrender.com/api/bookings/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: id }),
      });
      fetchBookings();
    } catch {
      alert("Scan failed.");
    }
  };

  const unscanBooking = async (id) => {
    try {
      await fetch("https://cinemaalbalad.onrender.com/api/bookings/unscan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: id }),
      });
      fetchBookings();
    } catch {
      alert("Unscan failed.");
    }
  };

  const handleScan = async () => {
    if (!bookingId) return;
    setError(""); setResult(null);
    try {
      const res = await fetch("https://cinemaalbalad.onrender.com/api/bookings/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.message || data.error);
      else setResult(data.booking);
    } catch {
      setError("Scan failed.");
    }
  };

  useEffect(() => {
    fetch("https://cinemaalbalad.onrender.com/api/movies")
      .then((res) => res.json())
      .then(setMovies)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const movie = movies.find((m) => m.title === selectedMovie);
    setShowtimes(movie?.showtimes || []);
    setTotalSeats(movie?.totalSeats || 48);
  }, [selectedMovie, movies]);

  useEffect(() => {
    if (selectedMovie && selectedDate && selectedTime) {
      fetchTakenSeats();
    }
  }, [selectedMovie, selectedDate, selectedTime]);

  const handleFreeBooking = async () => {
    if (!freeName || !selectedFreeSeat || !selectedMovie || !selectedDate || !selectedTime) {
      alert("Fill all fields.");
      return;
    }

    try {
      const res = await fetch("https://cinemaalbalad.onrender.com/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: freeName,
          email: "walkin@cinema.com",
          movie: selectedMovie,
          date: selectedDate,
          time: selectedTime,
          seats: [selectedFreeSeat],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || data.error);
        return;
      }

      await fetch("https://cinemaalbalad.onrender.com/api/bookings/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: data.bookingId }),
      });

      setFreeName("");
      setSelectedFreeSeat(null);
      alert("✅ Free booking added & scanned.");
      fetchBookings();
      fetchTakenSeats();
    } catch {
      alert("Failed to add booking.");
    }
  };

  const filteredBookings = bookings.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const seatButtons = Array.from({ length: totalSeats }, (_, i) => i + 1);

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8 font-cinema">
      <h1 className="text-3xl font-bold mb-6 text-center">🎟️ Scan Tickets</h1>

      <div className="max-w-md mx-auto space-y-4 mb-10">
        <input
          type="text"
          placeholder="Paste Booking ID"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          className="p-3 rounded text-black w-full"
        />
        <button
          onClick={handleScan}
          className="bg-green-600 w-full py-3 rounded-full font-semibold hover:bg-green-700"
        >
          Verify & Mark as Scanned
        </button>
        {error && <p className="text-red-400">{error}</p>}
        {result && (
          <div className="mt-4 bg-white text-black p-4 rounded shadow space-y-1">
            <p><strong>Name:</strong> {result.name}</p>
            <p><strong>Email:</strong> {result.email}</p>
            <p><strong>Movie:</strong> {result.movie}</p>
            <p><strong>Date:</strong> {result.date}</p>
            <p><strong>Time:</strong> {result.time}</p>
            <p><strong>Seats:</strong> {result.seats.map(seatLabel).join(", ")}</p>
            <p><strong>Status:</strong> ✅ Scanned</p>
          </div>
        )}
      </div>

      {/* Movie, date, time selection */}
      <div className="max-w-4xl mx-auto mb-10">
        <h2 className="text-2xl font-bold mb-4">📋 View Bookings by Movie & Time</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <select
            value={selectedMovie}
            onChange={(e) => {
              setSelectedMovie(e.target.value);
              setSelectedDate("");
              setSelectedTime("");
              setBookings([]);
              setTakenSeats([]);
            }}
            className="p-3 text-black rounded"
          >
            <option value="">Select Movie</option>
            {movies.map((m) => (
              <option key={m._id} value={m.title}>{m.title}</option>
            ))}
          </select>
          <select
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime("");
              setBookings([]);
              setTakenSeats([]);
            }}
            className="p-3 text-black rounded"
            disabled={!selectedMovie}
          >
            <option value="">Select Date</option>
            {[...new Set(showtimes.map((s) => s.date))].map((date) => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
          <select
            value={selectedTime}
            onChange={(e) => {
              setSelectedTime(e.target.value);
              fetchBookings();
            }}
            className="p-3 text-black rounded"
            disabled={!selectedDate}
          >
            <option value="">Select Time</option>
            {showtimes
              .filter((s) => s.date === selectedDate)
              .map((s, i) => (
                <option key={i} value={s.time}>{s.time}</option>
              ))}
          </select>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-6">
          <button
            className="bg-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-700"
            onClick={fetchBookings}
            disabled={!selectedMovie || !selectedDate || !selectedTime}
          >
            🔍 Load Bookings
          </button>
          <input
            type="text"
            placeholder="Search by name or email"
            className="mt-4 sm:mt-0 p-3 text-black rounded w-full sm:w-auto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={bookings.length === 0}
          />
        </div>

        {/* ➕ Free Booking Visual Grid */}
        <div className="bg-white/10 border border-white/20 p-6 rounded-xl mb-10">
          <h3 className="text-lg font-bold mb-4">➕ Free Booking (Cash)</h3>
          <input
            type="text"
            placeholder="Customer Name"
            value={freeName}
            onChange={(e) => setFreeName(e.target.value)}
            className="p-3 text-black rounded mb-4 w-full"
          />
          <div className="grid grid-cols-8 gap-2 mb-4">
            {seatButtons.map((seat) => (
              <button
                key={seat}
                onClick={() => setSelectedFreeSeat(seat)}
                disabled={takenSeats.includes(seat)}
                className={`h-10 rounded text-sm font-bold ${
                  takenSeats.includes(seat)
                    ? "bg-red-900 text-white"
                    : selectedFreeSeat === seat
                    ? "bg-red-600 text-white"
                    : "bg-gray-300 text-black hover:bg-red-200"
                }`}
              >
                {seatLabel(seat)}
              </button>
            ))}
          </div>
          <p className="text-sm mb-4">
            Selected: {selectedFreeSeat ? seatLabel(selectedFreeSeat) : "None"}
          </p>
          <button
            onClick={handleFreeBooking}
            className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700"
          >
            💸 Add Free Booking
          </button>
        </div>

        {/* Booking list */}
        {filteredBookings.length > 0 && (
          <div className="space-y-4 pb-20">
            {filteredBookings.map((b) => (
              <div
                key={b._id}
                className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center bg-white text-black p-4 rounded shadow space-y-3 sm:space-y-0"
              >
                <div className="text-sm sm:text-base">
                  <p><strong>{b.name}</strong> ({b.email})</p>
                  <p>{b.seats.map(seatLabel).join(", ")} – ID: {b._id}</p>
                  <p>Status: {b.scanned ? "✅ Scanned" : "❌ Not Scanned"}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  {!b.scanned ? (
                    <button
                      onClick={() => markAsScanned(b._id)}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      ✅ Scan
                    </button>
                  ) : (
                    <button
                      onClick={() => unscanBooking(b._id)}
                      className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      ⏪ Unscan
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
