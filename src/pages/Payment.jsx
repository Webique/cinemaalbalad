import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Payment() {
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(false);

  const movieId = searchParams.get("movieId");
  const time = searchParams.get("time");
  const count = Number(searchParams.get("count"));
  const amount = count * 35;

  const handlePayment = async (method) => {
    setProcessing(true);
    try {
      const res = await fetch("http://localhost:5000/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, movieId, time, count, method }),
      });

      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert("Payment failed. No URL.");
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
