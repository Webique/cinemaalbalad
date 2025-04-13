import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  useEffect(() => {
    if (!bookingData) {
      navigate("/");
    }
  }, [bookingData, navigate]);

  const handlePayment = async () => {
    console.log("🚀 Proceeding to payment...");
  
    try {
      const res = await fetch("http://localhost:5000/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 10000, // 100.00 SAR
          currency: "SAR",
          description: "Cinema Booking",
        }),
      });
  
      const data = await res.json();
      console.log("📦 Payment response:", data);
  
      if (data.success) {
        window.location.href = data.data.source.checkout_url;
      } else {
        alert("Payment failed.");
      }
    } catch (err) {
      console.error("💥 Error during payment:", err);
      alert("Something went wrong with payment.");
    }
  };
  
  

  if (!bookingData) return null;

  return (
    <>
      <Navbar />
      <main className="pt-36 min-h-screen text-white text-center px-6 sm:px-10 lg:px-20">
        <h1 className="text-4xl font-cinema mb-4">Payment</h1>
        <p className="text-lg mb-8">You're about to book <strong>{bookingData.movie}</strong> for {bookingData.seats.length} ticket(s).</p>
        <p className="text-lg mb-8">Total: <strong>{bookingData.seats.length * 35} SAR</strong></p>
        <button
          onClick={handlePayment}
          className="bg-primary text-white px-6 py-3 rounded-full text-lg shadow-md hover:scale-105 transition"
        >
          💳 Proceed to Payment
        </button>
      </main>
      <Footer />
    </>
  );
}
