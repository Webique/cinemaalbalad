import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
  
      // ✅ No alert, just redirect
      navigate("/");
    } catch (err) {
      alert(err.message || "Login failed.");
    }
  };
  

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
          <h1 className="text-4xl font-bold mb-8 text-center">Welcome Back</h1>
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm mb-1">
                <Mail size={18} /> Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
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

            {/* Forgot Password */}
            <div className="text-right text-sm">
              <Link to="#" className="text-primary hover:underline">Forgot Password?</Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-opacity-90 transition duration-300 py-3 rounded text-white font-semibold"
            >
              Log In
            </button>

            {/* Switch to signup */}
            <p className="text-center text-sm mt-4 text-gray-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">Sign Up</Link>
            </p>
          </form>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
