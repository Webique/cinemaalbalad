import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Payment() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [processing, setProcessing] = useState(false);

  const paymentId = searchParams.get("id");
  const rawDetails = searchParams.get("details");

  useEffect(() => {
    if (rawDetails) {
      try {
        const parsed = JSON.parse(decodeURIComponent(rawDetails));
        setBookingData(parsed);
      } catch (e) {
        console.error("Failed to parse booking details");
        navigate("/booking-failed");
      }
    }
  }, [rawDetails]);

  useEffect(() => {
    if (paymentId && bookingData) {
      verifyAndSaveBooking();
    }
  }, [paymentId, bookingData]);

  const verifyAndSaveBooking = async () => {
    try {
      const response = await fetch(`https://api.moyasar.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Basic ${btoa("sk_test_yourSecretKey:")}`, // Replace with real secret key
        },
      });

      const data = await response.json();
      console.log("💳 Payment Verification Result:", data);

      if (data.status === "paid") {
        // Proceed with saving booking
        const res = await fetch("https://cinemaalbalad.onrender.com/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        });

        const saved = await res.json();

        if (res.ok && saved.bookingId) {
          localStorage.setItem("latestBooking", JSON.stringify({
            ...bookingData,
            _id: saved.bookingId,
            qrCodeData: saved.qrCodeData || "",
          }));
          navigate("/thankyou");
        } else {
          console.error("❌ Failed to save booking:", saved);
          navigate("/booking-failed");
        }
      } else {
        console.error("❌ Payment not successful:", data.status);
        navigate("/booking-failed");
      }
    } catch (err) {
      console.error("❌ Error verifying payment:", err);
      navigate("/booking-failed");
    }
  };

  const startPayment = () => {
    if (!bookingData) {
      alert("Missing booking data.");
      return;
    }

    setProcessing(true);

    const script = document.createElement("script");
    script.src = "https://cdn.moyasar.com/mpf/1.15.0/moyasar.js";
    script.onload = () => {
      window.Moyasar.init({
        element: ".mysr-form",
        amount: bookingData.price * 100,
        currency: "SAR",
        description: `Cinema Al Balad - ${bookingData.movie}`,
        publishable_api_key: "pk_test_yourPublicKey", // Replace with your live key
        callback_url: `${window.location.origin}/payment?details=${encodeURIComponent(JSON.stringify(bookingData))}`,
        methods: ["creditcard"],
      });
    };
    document.body.appendChild(script);
  };

  if (paymentId) {
    return (
      <main className="text-white font-cinema flex items-center justify-center min-h-screen">
        <h1 className="text-3xl animate-pulse">🔄 Verifying Payment...</h1>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center text-white font-cinema overflow-hidden px-6">
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/main.png')" }}>
          <div className="w-full h-full bg-black/50 backdrop-blur-sm" />
        </div>
      </div>

      <div className="relative z-10 bg-black/30 backdrop-blur-md p-10 rounded-xl shadow-lg max-w-md w-full text-center space-y-8">
        <h1 className="text-4xl font-bold">{t('payment.chooseMethod')}</h1>

        <button
          onClick={startPayment}
          className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-full text-lg font-semibold shadow-md"
        >
          💳 {t('payment.payCard')}
        </button>

        <div className="mysr-form mt-6"></div>

        {processing && (
          <p className="text-gray-300 pt-4 animate-pulse">{t('payment.processingPayment')}</p>
        )}
      </div>
    </main>
  );
}
