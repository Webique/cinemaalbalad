import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // ✅ NEW

export default function Payment() {
  const { t } = useTranslation(); // ✅ NEW
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const success = searchParams.get("success");
  const details = searchParams.get("details");

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

  useEffect(() => {
    const confirmBooking = async () => {
      if (success === "true" && bookingData) {
        console.log("🚀 Confirming booking with backend:", bookingData);
        try {
          const res = await fetch("https://cinemaalbalad.onrender.com/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingData),
          });

          const data = await res.json();
          console.log("✅ Booking saved to MongoDB:", data);
          navigate("/thankyou");
        } catch (err) {
          console.error("❌ Booking save failed:", err);
          alert(t('payment.bookingError'));
          navigate("/");
        }
      }
    };

    confirmBooking();
  }, [success, bookingData, navigate, t]);

  const handlePayment = async (method) => {
    if (!bookingData) {
      alert(t('payment.missingDetails'));
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
        alert(t('payment.paymentFailed'));
        setProcessing(false);
      }
    } catch (err) {
      console.error("❌ Payment error:", err);
      alert(t('payment.paymentError'));
      setProcessing(false);
    }
  };

  if (!bookingData) {
    return (
      <main className="relative min-h-screen flex items-center justify-center text-white font-cinema overflow-hidden">
        {/* Blurred Background */}
        <div className="fixed top-0 left-0 w-full h-full -z-10">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url('/main.png')" }}
          >
            <div className="w-full h-full bg-black/50 backdrop-blur-sm" />
          </div>
        </div>

        <div className="relative z-10 text-center space-y-6">
          <h1 className="text-4xl font-bold">{t('payment.loadingDetails')}</h1>
        </div>
      </main>
    );
  }

  if (success === "true") {
    return (
      <main className="relative min-h-screen flex items-center justify-center text-white font-cinema overflow-hidden">
        {/* Blurred Background */}
        <div className="fixed top-0 left-0 w-full h-full -z-10">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url('/main.png')" }}
          >
            <div className="w-full h-full bg-black/50 backdrop-blur-sm" />
          </div>
        </div>

        <div className="relative z-10 text-center space-y-6">
          <h1 className="text-4xl font-bold animate-pulse">{t('payment.processingBooking')}</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center text-white font-cinema overflow-hidden px-6">
      {/* Blurred Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/main.png')" }}
        >
          <div className="w-full h-full bg-black/50 backdrop-blur-sm" />
        </div>
      </div>

      <div className="relative z-10 bg-black/30 backdrop-blur-md p-10 rounded-xl shadow-lg max-w-md w-full text-center space-y-8">
        <h1 className="text-4xl font-bold">{t('payment.chooseMethod')}</h1>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={() => handlePayment("creditcard")}
            className="bg-green-500 hover:bg-green-600 hover:scale-105 transition-all px-8 py-4 rounded-full text-lg font-semibold shadow-md"
          >
            💳 {t('payment.payCard')}
          </button>
  {/* 
  <button
    onClick={() => handlePayment("applepay")}
    className="bg-black hover:bg-gray-900 hover:scale-105 transition-all px-8 py-4 rounded-full text-lg font-semibold shadow-md"
  >
     {t('payment.payApple')}
  </button>
  */}
        </div>

        {processing && (
          <p className="text-gray-300 pt-4 animate-pulse">🔄 {t('payment.processingPayment')}</p>
        )}
      </div>
    </main>
  );
}
