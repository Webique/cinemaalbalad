import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function BookingFailed() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const toggleLanguage = () => {
    i18n.changeLanguage(isArabic ? "en" : "ar");
  };

  return (
    <motion.div
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-screen flex flex-col justify-center items-center bg-black text-white text-center p-4 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button
        onClick={toggleLanguage}
        className="absolute top-4 right-4 text-sm px-3 py-1 bg-gray-800 rounded-md hover:bg-gray-700"
      >
        {isArabic ? "EN" : "AR"}
      </button>

      <h1 className="text-4xl font-bold mb-4">
        {isArabic ? "فشل الحجز" : "Booking Failed"}
      </h1>
      <p className="text-lg mb-4">
        {isArabic
          ? "حدث خطأ أثناء معالجة الدفع الخاص بك."
          : "Something went wrong while processing your payment."}
      </p>
      <p className="text-md mb-6 max-w-xl text-balance">
        {isArabic ? (
          <>
            إذا كنت تعتقد أن هناك خطأ أو تم سحب المبلغ من حسابك، يرجى إرسال بريد إلكتروني إلى{" "}
            <a
              href="mailto:startwithwebique@gmail.com"
              className="underline text-blue-400"
            >
              startwithwebique@gmail.com
            </a>{" "}
            مع ذكر اسمك، بريدك الإلكتروني، وتفاصيل التذكرة التي حجزتها.
          </>
        ) : (
          <>
            If you believe this is an error or the amount has already been withdrawn from your account, please email{" "}
            <a
              href="mailto:startwithwebique@gmail.com"
              className="underline text-blue-400"
            >
              startwithwebique@gmail.com
            </a>{" "}
            with your name, email, and the ticket details you booked.
          </>
        )}
      </p>
      <Link
        to="/movies"
        className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl transition"
      >
        {isArabic ? "العودة إلى الأفلام" : "Go Back to Movies"}
      </Link>
    </motion.div>
  );
}
