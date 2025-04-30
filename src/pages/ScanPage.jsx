import { useState } from "react";

export default function ScanPage() {
  const [bookingId, setBookingId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

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
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
      <h1 className="text-3xl font-bold mb-6">🎟️ Scan Ticket</h1>

      <input
        type="text"
        placeholder="Paste booking ID"
        value={bookingId}
        onChange={(e) => setBookingId(e.target.value)}
        className="p-3 rounded text-black w-full max-w-md mb-4"
      />

      <button
        onClick={handleScan}
        className="bg-green-600 px-6 py-3 rounded-full font-semibold hover:bg-green-700"
      >
        Verify & Mark as Scanned
      </button>

      {error && <p className="text-red-400 mt-4">{error}</p>}

      {result && (
        <div className="mt-8 text-left bg-white text-black p-6 rounded shadow max-w-md w-full space-y-2">
          <p><strong>Name:</strong> {result.name}</p>
          <p><strong>Email:</strong> {result.email}</p>
          <p><strong>Movie:</strong> {result.movie}</p>
          <p><strong>Date:</strong> {result.date}</p>
          <p><strong>Time:</strong> {result.time}</p>
          <p><strong>Seats:</strong> {result.seats.join(", ")}</p>
          <p><strong>Status:</strong> ✅ Scanned</p>
        </div>
      )}
    </main>
  );
}
