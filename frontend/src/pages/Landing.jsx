import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 relative overflow-hidden">
        {/* Floating background glow */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-3xl"
          animate={{ x: [0, 100, -100, 0], y: [0, -80, 80, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-purple-500/20 blur-3xl"
          animate={{ x: [0, -120, 120, 0], y: [0, 100, -100, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          MediShelf Monitor
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl"
        >
          Share medicines you don’t need. Discover the ones you do. Connect
          securely with people around you.
        </motion.p>

        <motion.div
          className="mt-8 flex gap-4 flex-wrap justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Link
            to="/signup"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-500 text-white font-semibold shadow-lg transition"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition"
          >
            Login
          </Link>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-950 relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">Why MediShelf?</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Share Medicines",
                desc: "List medicines you no longer need and help others find them easily.",
              },
              {
                title: "Search & Discover",
                desc: "Smart search with AI-generated instructions to guide safe usage.",
              },
              {
                title: "Chat Securely",
                desc: "Connect with post authors and chat like a normal conversation.",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.3 }}
                className="p-8 bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transition"
              >
                <h3 className="text-xl font-semibold text-blue-400">
                  {f.title}
                </h3>
                <p className="text-gray-300 mt-3">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gradient-to-r from-blue-900/30 via-purple-900/20 to-gray-900">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: "1", text: "Sign up and create your profile." },
              { step: "2", text: "Post or search for medicines." },
              { step: "3", text: "Chat and connect securely." },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.3 }}
                className="p-8 bg-gray-800/50 rounded-2xl shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] transition"
              >
                <div className="text-4xl font-extrabold text-blue-400">
                  {s.step}
                </div>
                <p className="mt-3 text-gray-300">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <footer className="py-16 bg-gradient-to-r from-blue-700 to-purple-700 text-center">
        <h2 className="text-3xl font-bold">Ready to get started?</h2>
        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          <Link
            to="/signup"
            className="px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold shadow hover:scale-105 transition"
          >
            Create Account
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 bg-black/40 text-white rounded-lg font-semibold border border-white/20 hover:bg-white/20 transition"
          >
            Login
          </Link>
        </div>
      </footer>
    </div>
  );
}
