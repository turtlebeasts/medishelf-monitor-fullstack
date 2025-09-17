import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";

export default function ConversationsList() {
  const [convos, setConvos] = useState([]);

  const fetchConvos = async () => {
    try {
      const res = await API.get("/conversations/");
      setConvos(res.data.results || res.data);
    } catch (err) {
      console.error("Error fetching conversations", err);
    }
  };

  useEffect(() => {
    fetchConvos();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Your Conversations</h1>

      {convos.length === 0 ? (
        <p className="text-gray-400">No conversations yet.</p>
      ) : (
        <div className="space-y-3">
          {convos.map((convo, i) => {
            const other = convo.participants.find(
              (p) => p.username !== localStorage.getItem("username")
            );

            return (
              <motion.div
                key={convo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/chat/${convo.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 shadow hover:shadow-blue-500/30 hover:scale-[1.02] transition"
                >
                  {/* Avatar Placeholder */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {other?.username?.[0]?.toUpperCase() || "?"}
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1">
                    <p className="font-semibold text-white">
                      {other?.username || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-400 truncate">
                      Post ID: {convo.post}
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <span className="text-gray-500">›</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
