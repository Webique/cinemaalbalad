import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetail from "./pages/MovieDetail";
import BookNow from "./pages/BookNow";
import Contact from "./pages/Contact";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/movies/:id" element={<MovieDetail />} />
      <Route path="/book" element={<BookNow />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}
