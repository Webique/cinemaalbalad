import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function BookNow() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [form, setForm] = useState({ name: "", email: "", date: "", time: "", tickets: 0 });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const movieId = searchParams.get("movieId");
  const prefilledTime = searchParams.get("time");
  const [ticketCount, setTicketCount] = useState(1);


  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [takenSeats, setTakenSeats] = useState([]);


  const [totalSeats, setTotalSeats] = useState(48); // default value
  const isFreeShow = selectedMovie?.ticketPrice === 0;



  // Dynamically generate seat numbers based on total
  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);
  


  const seatLabel = (seat) => {
    const row = String.fromCharCode(65 + Math.floor((seat - 1) / 8)); // A–F
    const number = ((seat - 1) % 8) + 1; // 1–8
    return `${row}${number}`;
  };
  

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`https://cinemaalbalad.onrender.com/api/movies/${movieId}`);
        const data = await res.json();
        if (data && data.title) {
          setSelectedMovie(data);
          setTotalSeats(data.totalSeats || 48); // 👈 dynamically set total seats
        } else {
          console.error("Invalid movie data", data);
        }
        
      } catch (err) {
        console.error("Failed to fetch movie:", err);
      }
    };
    if (movieId) fetchMovie();
  }, [movieId]);

  useEffect(() => {
    if (!selectedMovie || !prefilledTime) return;

    const matchingShow = selectedMovie.showtimes.find((s) => s.time === prefilledTime);

    if (matchingShow) {
      setForm((prev) => ({
        ...prev,
        time: prefilledTime,
        date: matchingShow.date,
        tickets: 0,
      }));
      setSelectedSeats([]);
    }
  }, [selectedMovie, prefilledTime]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seat));
    } else {
      if (selectedSeats.length < prefilledCount) {
        setSelectedSeats((prev) => [...prev, seat]);
      }
    }
  };
  
  useEffect(() => {
    const fetchTakenSeats = async () => {
      if (!selectedMovie || !form.date || !form.time) return;

      try {
        const res = await fetch(
          `https://cinemaalbalad.onrender.com/api/bookings/taken-seats?movie=${selectedMovie.title}&date=${form.date}&time=${form.time}`
        );
        const data = await res.json();
        setTakenSeats(data.takenSeats || []);
      } catch (err) {
        console.error("Error fetching taken seats:", err);
      }
    };

    fetchTakenSeats();
  }, [selectedMovie, form.date, form.time]);
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!form.name || !form.email || !form.date || !form.time || !selectedMovie) {
      alert(t('booknow.fillFields'));
      return;
    }
  
    const availableSeats = seats.filter(s => !takenSeats.includes(s));
    const autoSelected = availableSeats.slice(0, ticketCount);
    
    if (autoSelected.length < ticketCount) {
      alert(`Only ${autoSelected.length} tickets remaining. Please reduce your selection.`);
      return;
    }
    
    
    setSelectedSeats(autoSelected); // optional visual sync
    
  
    const bookingDetails = {
      name: form.name,
      email: form.email,
      movie: selectedMovie.title,
      time: form.time,
      date: form.date,
      seats: autoSelected,
      price: autoSelected.length * selectedMovie.ticketPrice,
    };
    
  
    const queryString = encodeURIComponent(JSON.stringify(bookingDetails));
  
    if (selectedMovie.ticketPrice === 0) {
      try {
        const res = await fetch("https://cinemaalbalad.onrender.com/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...bookingDetails, price: 0, paymentId: "free" }),
        });
    
        const data = await res.json();
        if (res.ok && data.bookingId) {
          localStorage.setItem("latestBooking", JSON.stringify({
            ...bookingDetails,
            _id: data.bookingId,
            qrCodeData: data.qrCodeData || "",
          }));
          navigate("/thankyou");
        } else {
          console.error("Booking failed:", data);
          navigate("/booking-failed");
        }
      } catch (err) {
        console.error("❌ Free booking error:", err);
        navigate("/booking-failed");
      }
    } else {
      navigate(`/payment?details=${queryString}`);
    }
    
  };
  

  if (!selectedMovie) {
    return (
      <>
        <Navbar />
        <main
          dir={isArabic ? "rtl" : "ltr"}
          className="relative min-h-screen text-white font-cinema overflow-hidden pt-36 text-center"
        >
          <div className="fixed top-0 left-0 w-full h-full -z-10">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: "url('/main.png')" }}
            >
              <div className="w-full h-full bg-black/50 backdrop-blur-sm" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">{t('booknow.loading')}</h1>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main
  dir={isArabic ? "rtl" : "ltr"}
  className={`relative min-h-screen text-white font-cinema overflow-hidden pt-36 px-6 sm:px-10 lg:px-20 pb-32 ${
    isArabic ? "text-right" : "text-left"
  }`}
>

        <div className="fixed top-0 left-0 w-full h-full -z-10">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: "url('/main.png')" }}
          >
            <div className="w-full h-full bg-black/50 backdrop-blur-sm" />
          </div>
        </div>

        <motion.section className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl mb-6 font-bold">{t('booknow.title')}</h1>
          <p className="text-gray-300 text-lg mb-12">
            {t('booknow.movie')}: <strong className="text-primary">{selectedMovie.title}</strong>
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-black/30 backdrop-blur-md p-6 rounded-xl shadow-lg text-white"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t('booknow.name')}
                className="px-4 py-3 rounded bg-white/90 text-black border border-gray-300"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t('booknow.email')}
                className="px-4 py-3 rounded bg-white/90 text-black border border-gray-300"
              />
            </div>
            <div className="mt-8 bg-black/20 rounded-lg py-6 px-4 mb-6 text-center">
  <p className="text-lg font-semibold">General Admission Ticket</p>
  <p className="text-sm text-gray-300 mt-2">
    Tickets Remaining:{" "}

    <div className="mt-6 text-center">
  <label className="block text-sm text-gray-300 mb-2">Number of Tickets</label>
  <div className="inline-flex items-center bg-white/10 border border-white/20 rounded overflow-hidden">
    <button
      type="button"
      onClick={() => setTicketCount((prev) => Math.max(1, prev - 1))}
      className="px-3 py-2 text-white hover:bg-white/20 transition"
    >
      -
    </button>
    <span className="px-4 py-2 text-white bg-white/5 min-w-[2.5rem] text-center">{ticketCount}</span>
    <button
      type="button"
      onClick={() => setTicketCount((prev) => Math.min(10, prev + 1))}
      className="px-3 py-2 text-white hover:bg-white/20 transition"
    >
      +
    </button>
  </div>
</div>

    <span className="font-bold text-white">
      {totalSeats - takenSeats.length}
    </span>
  </p>

</div>




            <div className="mt-6 text-left sm:text-center text-white">
  <p className="text-sm">
    {t('booknow.selected')}: {selectedSeats.map(seatLabel).join(", ") || t('booknow.none')}
  </p>
  <p className="text-sm">{t('booknow.totalTickets')}: {selectedSeats.length}</p>
  {isFreeShow ? (
  <p className="text-sm text-green-400 font-semibold">
    🎉 This is a free screening!
  </p>
) : (
  <p className="text-sm flex items-center gap-2 text-left sm:justify-center sm:text-center">
    {t('booknow.totalPrice')}: 
    <span className="text-white font-bold flex items-center gap-1">
    {isFreeShow ? 0 : ticketCount * (selectedMovie.ticketPrice || 35)}

      <img
        src="/saudi-riyal.png"
        alt="SAR"
        className="w-5 h-5 sm:w-6 sm:h-6"
      />
    </span>
  </p>
)}



</div>


            <div className="mt-8 text-center">
              <button
                type="submit"
                className="bg-primary hover:bg-primary/80 px-8 py-3 rounded-full text-white text-lg transition duration-300"
              >
                🎟 {t('booknow.reserve')}
              </button>
            </div>
          </form>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}
