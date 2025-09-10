import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

export default function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Register
      await API.post("/auth/register/", form);

      // Step 2: Auto-login after signup
      const res = await API.post("/auth/token/", {
        username: form.username,
        password: form.password,
      });

      localStorage.setItem("token", res.data.access);
      localStorage.setItem("username", form.username);
      navigate("/dashboard");
    } catch (err) {
      alert("Signup failed, try again");
    }
  };

  return (
    <div className="relative flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Floating Background Orbs */}
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-blue-600/30 blur-3xl"
        animate={{ x: [0, 50, -50, 0], y: [0, 40, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-purple-500/20 blur-3xl"
        animate={{ x: [0, -60, 60, 0], y: [0, -50, 50, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Card */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-96 p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-white">
          Create Account
        </h2>
        <p className="text-sm text-gray-300 text-center">
          Join MediShelf and start connecting
        </p>

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
        />

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-blue-500/50 transition"
        >
          Sign Up
        </motion.button>

        <p className="text-sm text-center text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
