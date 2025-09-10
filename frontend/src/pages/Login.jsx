import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/token/", { username, password });
      localStorage.setItem("token", res.data.access);
      localStorage.setItem("username", username);
      if (onLogin) onLogin();
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="relative flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Floating Background Orbs */}
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-purple-600/30 blur-3xl"
        animate={{ x: [0, 50, -50, 0], y: [0, 40, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-pink-500/20 blur-3xl"
        animate={{ x: [0, -60, 60, 0], y: [0, -50, 50, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Card */}
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-96 p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-white">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-300 text-center">
          Please login to continue
        </p>

        <input
          type="text"
          placeholder="Username"
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow-lg hover:shadow-purple-500/50 transition"
        >
          Login
        </motion.button>

        <p className="text-sm text-center text-gray-300">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-purple-400 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
