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

  // Fetch movies and showtimes
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("https://cinemaalbalad.onrender.com/api/movies");
        const data = await res.json();
        setMovies(data);
      } catch (err) {
        console.error("Failed to load movies:", err);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    if (selectedMovie) {
      const movie = movies.find((m) => m.title === selectedMovie);
      if (movie) setShowtimes(movie.showtimes || []);
    } else {
      setShowtimes([]);
    }
  }, [selectedMovie, movies]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(
        `https://cinemaalbalad.onrender.com/api/bookings/by-showtime?movie=${encodeURIComponent(
          selectedMovie
        )}&date=${selectedDate}&time=${selectedTime}`
      );
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Failed to load bookings:", err);
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

      if (!res.ok) {
        alert(data.error || data.message);
      } else {
        // update list
        fetchBookings();
      }
    } catch (err) {
      alert("Failed to mark as scanned.");
    }
  };

  const handleScan = async () => {
    setError("");
    setResult(null);

    try {
      const res = await fetch("https://cinemaalbalad.onrender.com/api/bookings/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.message);
      } else {
        setResult(data.booking);
      }
    } catch (err) {
      setError("Something went wrong.");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10 font-cinema">
      <h1 className="text-3xl font-bold mb-8 text-center">🎟️ Scan Tickets</h1>

      {/* Manual Input */}
      <div className="max-w-md mx-auto space-y-4 mb-12">
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
          <div className="mt-6 bg-white text-black p-4 rounded space-y-1 shadow">
            <p><strong>Name:</strong> {result.name}</p>
            <p><strong>Email:</strong> {result.email}</p>
            <p><strong>Movie:</strong> {result.movie}</p>
            <p><strong>Date:</strong> {result.date}</p>
            <p><strong>Time:</strong> {result.time}</p>
            <p><strong>Seats:</strong> {result.seats.join(", ")}</p>
            <p><strong>Status:</strong> ✅ Scanned</p>
          </div>
        )}
      </div>

      {/* Movie & Showtime Selection */}
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

        <button
          className="bg-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-700 mb-6"
          onClick={fetchBookings}
          disabled={!selectedMovie || !selectedDate || !selectedTime}
        >
          🔍 Load Bookings
        </button>

        {bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="flex justify-between items-center bg-white text-black p-4 rounded shadow"
              >
                <div>
                  <p><strong>{b.name}</strong> ({b.email})</p>
                  <p>{b.seats.join(", ")} – ID: {b._id}</p>
                  <p>Status: {b.scanned ? "✅ Scanned" : "❌ Not Scanned"}</p>
                </div>
                {!b.scanned && (
                  <button
                    onClick={() => markAsScanned(b._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    ✅ Scan
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
