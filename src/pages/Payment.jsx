import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function Payment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  // Get query params
  const success = searchParams.get("success");
  const details = searchParams.get("details");

  // Parse bookingData from URL param
  useEffect(() => {
    if (details) {
      try {
        const parsed = JSON.parse(decodeURIComponent(details));
        console.log("🧾 Parsed booking data from URL:", parsed);
        setBookingData(parsed);
      } catch (err) {
        console.error("❌ Failed to parse booking details:", err);
      }
    }
  }, [details]);

  // On return from payment, confirm booking to backend
  useEffect(() => {
    const confirmBooking = async () => {
      if (success === "true" && bookingData) {
        console.log("🚀 Sending booking to backend:", bookingData);
        try {
          const res = await fetch("http://localhost:5000/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingData),
          });

          const data = await res.json();
          console.log("✅ Booking saved to MongoDB:", data);
          navigate("/thankyou");
        } catch (err) {
          console.error("❌ Booking save failed:", err);
          alert("Something went wrong saving your booking.");
        }
      }
    };

    confirmBooking();
  }, [success, bookingData]);

  // Handle pay button click
  const handlePayment = async (method) => {
    if (!bookingData) {
      alert("Booking details missing.");
      return;
    }

    setProcessing(true);

    try {
      const res = await fetch("https://cinemaalbalad.onrender.com/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: bookingData.price,
          movieId: bookingData.movie,
          time: bookingData.time,
          count: bookingData.seats.length,
          method,
          redirectUrl: `${window.location.origin}/payment?success=true&details=${encodeURIComponent(
            JSON.stringify(bookingData)
          )}`,
        }),
      });

      const data = await res.json();

      if (data?.url) {
        console.log("🔁 Redirecting to payment page:", data.url);
        window.location.href = data.url;
      } else {
        alert("Payment failed. No redirect URL.");
        setProcessing(false);
      }
    } catch (err) {
      console.error("❌ Payment error:", err);
      alert("Payment failed.");
      setProcessing(false);
    }
  };

  return (
    <div className="text-white text-center pt-40 space-y-6">
      <h1 className="text-3xl font-bold">Choose a Payment Method</h1>

      <div className="flex gap-6 justify-center mt-8">
        <button
          onClick={() => handlePayment("creditcard")}
          className="bg-green-500 px-6 py-3 rounded-full hover:scale-105 transition"
        >
          💳 Pay with Card / Mada
        </button>
        <button
          onClick={() => handlePayment("applepay")}
          className="bg-black px-6 py-3 rounded-full hover:scale-105 transition"
        >
           Apple Pay
        </button>
      </div>

      {processing && <p className="text-gray-400 pt-6">🔄 Processing Payment...</p>}
    </div>
  );
}
