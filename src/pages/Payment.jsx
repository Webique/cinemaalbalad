import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Payment() {
  const { t } = useTranslation();
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

          localStorage.setItem("latestBooking", JSON.stringify({
            ...bookingData,
            _id: data.bookingId,
            qrCodeData: data.qrCodeData || ""
          }));

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

  const startMoyasarPayment = () => {
    if (!bookingData) {
      alert(t('payment.missingDetails'));
      return;
    }

    setProcessing(true);

    const script = document.createElement("script");
    script.src = "https://cdn.moyasar.com/mpf/1.15.0/moyasar.js";
    script.onload = () => {
      window.Moyasar.init({
        element: ".mysr-form",
        amount: bookingData.price * 100, // in Halalas
        currency: "SAR",
        description: `Booking for ${bookingData.movie}`,
        publishable_api_key: "pk_live_7rNCmzYDRdxgfkcjsmZRUqvruqJ7hDQKP8QpZHfR", // 🔑 Replace with your real key
        callback_url: `${window.location.origin}/payment?success=true&details=${encodeURIComponent(
          JSON.stringify(bookingData)
        )}`,
        methods: ["creditcard"],
      });
    };
    document.body.appendChild(script);
  };

  if (!bookingData) {
    return (
      <main className="relative min-h-screen flex items-center justify-center text-white font-cinema overflow-hidden">
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
            onClick={startMoyasarPayment}
            className="bg-green-500 hover:bg-green-600 hover:scale-105 transition-all px-8 py-4 rounded-full text-lg font-semibold shadow-md"
          >
            💳 {t('payment.payCard')}
          </button>
        </div>

        <div className="mysr-form mt-6"></div>

        {processing && (
          <p className="text-gray-300 pt-4 animate-pulse">🔄 {t('payment.processingPayment')}</p>
        )}
      </div>
    </main>
  );
}
