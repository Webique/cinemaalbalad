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

  // ➕ Free manual booking form
  const [freeName, setFreeName] = useState("");
  const [freeEmail, setFreeEmail] = useState("");
  const [freeSeat, setFreeSeat] = useState("");

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

  const markAsScanned = async (id) => {
    try {
      const res = await fetch("https://cinemaalbalad.onrender.com/api/bookings/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: id }),
      });
      const data = await res.json();
      if (!res.ok) alert(data.message || data.error);
      fetchBookings();
    } catch {
      alert("Scan failed.");
    }
  };

  const unscanBooking = async (id) => {
    try {
      const res = await fetch("https://cinemaalbalad.onrender.com/api/bookings/unscan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: id }),
      });
      const data = await res.json();
      if (!res.ok) alert(data.message || data.error);
      fetchBookings();
    } catch {
      alert("Unscan failed.");
    }
  };

  const handleScan = async () => {
    if (!bookingId) return;
    setError("");
    setResult(null);
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
  }, [selectedMovie, movies]);

  const filteredBookings = bookings.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFreeBooking = async () => {
    if (!freeName || !freeEmail || !freeSeat || !selectedMovie || !selectedDate || !selectedTime) {
      alert("Fill all fields to book manually.");
      return;
    }

    const seatNum = parseInt(freeSeat);
    if (isNaN(seatNum) || seatNum < 1 || seatNum > 48) {
      alert("Seat must be between 1 and 48.");
      return;
    }

    try {
      const res = await fetch("https://cinemaalbalad.onrender.com/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: freeName,
          email: freeEmail,
          movie: selectedMovie,
          date: selectedDate,
          time: selectedTime,
          seats: [seatNum],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || data.error);
        return;
      }

      // Immediately mark as scanned
      await fetch("https://cinemaalbalad.onrender.com/api/bookings/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: data.bookingId }),
      });

      setFreeName("");
      setFreeEmail("");
      setFreeSeat("");
      alert("✅ Free booking created and marked as scanned");
      fetchBookings();
    } catch {
      alert("Failed to create free booking.");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8 font-cinema">
      <h1 className="text-3xl font-bold mb-6 text-center">🎟️ Scan Tickets</h1>

      {/* ✅ Manual Scan */}
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
          <div className="mt-4 bg-white text-black p-4 rounded space-y-1 shadow">
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

      {/* 🎞️ Bookings per Movie/Time */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">📋 View Bookings by Movie & Time</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <select
            value={selectedMovie}
            onChange={(e) => {
              setSelectedMovie(e.target.value);
              setSelectedDate("");
              setSelectedTime("");
              setBookings([]);
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
            onChange={(e) => setSelectedTime(e.target.value)}
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

        {/* ➕ Manual Free Booking */}
        <div className="bg-white/10 border border-white/20 p-6 rounded-xl mb-10">
          <h3 className="text-lg font-bold mb-4">➕ Create Free Booking (Cash/Walk-in)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input type="text" placeholder="Name" value={freeName} onChange={(e) => setFreeName(e.target.value)} className="p-3 text-black rounded" />
            <input type="email" placeholder="Email" value={freeEmail} onChange={(e) => setFreeEmail(e.target.value)} className="p-3 text-black rounded" />
            <input type="number" placeholder="Seat Number (1-48)" value={freeSeat} onChange={(e) => setFreeSeat(e.target.value)} className="p-3 text-black rounded" />
          </div>
          <button
            onClick={handleFreeBooking}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700"
          >
            💸 Add Free Booking
          </button>
        </div>

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
