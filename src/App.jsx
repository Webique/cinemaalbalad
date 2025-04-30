import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next"; // ✅ NEW import
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetail from "./pages/MovieDetail";
import BookNow from "./pages/BookNow";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import About from "./pages/About";
import ThankYou from "./pages/ThankYou";
import AdminPanel from "./pages/AdminPanel"; 
import Payment from "./pages/Payment";
import ScrollToTop from "./components/ScrollToTop"; // ✅ Import it
import Terms from "./pages/Terms"; // ✅ Import it
import "./i18n"; // 👈 Import i18n so it initializes
import ScanPage from "./pages/ScanPage";



export default function App() {
  const { i18n } = useTranslation(); // ✅ NEW hook for dynamic font

  return (
    <div className={i18n.language === "ar" ? "font-arabic" : "font-cinema"}> {/* ✅ Dynamic font switch */}
      <ScrollToTop /> {/* ✅ Instantly resets scroll on every page change */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/booknow" element={<BookNow />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/thankyou" element={<ThankYou />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/scan" element={<ScanPage />} />

      </Routes>
    </div> 
  );
}
