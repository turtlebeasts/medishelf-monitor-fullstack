import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import AnimatePage from "../components/AnimatePage";
import { motion } from "framer-motion";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  const fetchPosts = async (q = "") => {
    try {
      const res = await API.get(`/posts/?search=${q}`);
      setPosts(res.data.results);
    } catch (err) {
      console.error("Error fetching posts", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(search);
  };

  return (
    <AnimatePage>
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            Public Medicine Feed
          </h1>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex space-x-2 mb-6 bg-white/10 rounded-lg p-2 backdrop-blur-lg border border-white/20"
        >
          <input
            type="text"
            placeholder="Search medicines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow hover:scale-105 transition"
          >
            Search
          </button>
        </form>

        {/* Feed Posts */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <p className="text-gray-400 text-center">
              No posts found. Try searching again.
            </p>
          ) : (
            posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="p-6 bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg hover:shadow-blue-500/30 transition"
              >
                {/* Post Header */}
                <div className="flex justify-between items-center mb-2">
                  <Link
                    to={`/posts/${post.id}`}
                    className="text-xl font-semibold text-blue-400 hover:underline"
                  >
                    {post.name}
                  </Link>
                  <span className="text-xs text-gray-400">
                    by {post.author?.username || "Unknown"}
                  </span>
                </div>

                {/* Post Body */}
                <p className="text-gray-200 mb-2">{post.description}</p>
                <p className="text-sm text-gray-400">
                  ₹ {post.price} | 📅 {post.expiry_date}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </AnimatePage>
  );
}
