import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function PrivateLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const navLinks = [
    { path: "/feed", label: "📋 Feed" },
    { path: "/dashboard", label: "⚡ Dashboard" },
    { path: "/conversations", label: "💬 Conversations" },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 border-r border-white/10 p-6 flex flex-col"
      >
        {/* Brand */}
        <div className="flex items-center gap-2 mb-10">
          <span className="text-2xl">💊</span>
          <h1 className="text-xl font-bold tracking-wide text-blue-400">
            MediShelf
          </h1>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col space-y-2">
          {navLinks.map((link, i) => {
            const active = location.pathname === link.path;
            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to={link.path}
                  className={`block px-4 py-2 rounded-lg font-medium transition ${
                    active
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Logout */}
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-auto px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition font-semibold shadow-lg"
        >
          Logout
        </motion.button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-gray-950 via-gray-900 to-black">
        <Outlet />
      </main>
    </div>
  );
}
