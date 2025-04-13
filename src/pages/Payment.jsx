import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function Payment() {
  const [searchParams] = useSearchParams();

  const movieId = searchParams.get("movieId");
  const time = searchParams.get("time");
  const count = Number(searchParams.get("count"));
  const amount = count * 35;

  useEffect(() => {
    const startPayment = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, movieId, time, count }),
        });

        const data = await res.json();

        if (data?.url) {
          window.location.href = data.url;
        } else {
          alert("Payment failed. No URL.");
        }
      } catch (err) {
        console.error("❌ Payment error:", err);
        alert("Payment failed.");
      }
    };

    startPayment();
  }, [amount, movieId, time, count]);

  return <h1 className="text-white pt-40 text-center">🔄 Processing Payment...</h1>;
}
