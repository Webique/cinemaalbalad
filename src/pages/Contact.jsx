import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully! ✅");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      <Navbar />
      <main className="relative z-0 bg-[#fdf8f6] text-black font-cinema pt-40 pb-36 min-h-screen px-6 sm:px-10 lg:px-20">

        <motion.section
          className="max-w-4xl mx-auto text-center z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl mb-4 font-semibold">Get in Touch</h1>
          <p className="text-gray-700 text-lg mb-12 max-w-2xl mx-auto">
            Have questions, suggestions, or feedback? We’d love to hear from you.
          </p>

          <motion.form
            onSubmit={handleSubmit}
            className="bg-black/5 p-8 sm:p-10 rounded-xl backdrop-blur-md shadow-2xl space-y-6 text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <div>
              <label className="block text-sm text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded bg-white border border-gray-200 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded bg-white border border-gray-200 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="5"
                placeholder="Write your message here..."
                className="w-full px-4 py-3 rounded bg-white border border-gray-200 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              ></textarea>
            </div>

            <div className="text-center pt-4">
              <button
                type="submit"
                className="bg-primary px-8 py-4 rounded-full text-white text-lg shadow-md hover:scale-105 transition duration-300"
              >
                ✉️ Send Message
              </button>
            </div>
          </motion.form>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}
