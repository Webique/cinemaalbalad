import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-secondary via-black to-secondary pt-40 px-6 sm:px-10 lg:px-20 font-cinema text-white">
        <motion.div
          className="max-w-xl mx-auto bg-white/5 backdrop-blur-md rounded-xl shadow-xl p-8 sm:p-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold mb-8 text-center">Create an Account</h1>
          <form className="space-y-6">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm mb-1">
                <User size={18} /> Full Name
              </label>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm mb-1">
                <Mail size={18} /> Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Password */}
            <div>
              <label className="flex items-center gap-2 text-sm mb-1">
                <Lock size={18} /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-300 hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Terms checkbox (visual only) */}
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" id="terms" className="accent-primary" />
              <label htmlFor="terms">
                I agree to the <span className="underline">Terms & Conditions</span>.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-opacity-90 transition duration-300 py-3 rounded text-white font-semibold"
            >
              Sign Up
            </button>

            {/* Switch to login */}
            <p className="text-center text-sm mt-4 text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">Log In</Link>
            </p>
          </form>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
