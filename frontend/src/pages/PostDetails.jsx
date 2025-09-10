import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await API.get(`/posts/${id}/`);
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching post", err);
      }
    };
    fetchPost();
  }, [id]);

  const handleMessageSeller = async () => {
    try {
      const res = await API.post("/conversations/", { post: post.id });
      navigate(`/chat/${res.data.id}`);
    } catch (err) {
      alert("Error starting conversation");
    }
  };

  const handleGetInstructions = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/posts/${id}/instructions/`);
      setInstructions(res.data.instructions);
    } catch (err) {
      alert("Error fetching instructions");
    } finally {
      setLoading(false);
    }
  };

  if (!post)
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading...
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-6 space-y-6 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg"
    >
      {/* Post Title */}
      <div>
        <h1 className="text-3xl font-bold text-white">{post.name}</h1>
        <p className="mt-2 text-gray-300">{post.description}</p>
      </div>

      {/* Meta Info */}
      <div className="text-sm text-gray-400">
        💰 {post.price} | ⏳ {post.expiry_date}
        <p className="text-xs mt-1">Posted by {post.author?.username}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <motion.button
          onClick={handleMessageSeller}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow hover:shadow-blue-500/30 transition"
        >
          💬 Message Seller
        </motion.button>
        <motion.button
          onClick={handleGetInstructions}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className="px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow hover:shadow-green-500/30 transition disabled:opacity-50"
        >
          {loading ? "⏳ Generating..." : "📘 Get Instructions"}
        </motion.button>
      </div>

      {/* AI Instructions */}
      {instructions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-5 bg-gray-900/60 rounded-xl border border-gray-700"
        >
          <h2 className="text-lg font-semibold text-white mb-2">
            AI Instructions
          </h2>
          <p className="text-sm text-gray-300 whitespace-pre-line">
            {instructions}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
