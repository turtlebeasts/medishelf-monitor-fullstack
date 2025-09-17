import { useEffect, useState } from "react";
import API from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    expiry_date: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts/mine/");
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching user posts", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/posts/${editingId}/`, form);
        setEditingId(null);
      } else {
        await API.post("/posts/", form);
      }
      setForm({ name: "", description: "", price: "", expiry_date: "" });
      setShowForm(false);
      fetchPosts();
    } catch (err) {
      alert("Error saving post");
    }
  };

  const handleEdit = (post) => {
    setForm({
      name: post.name,
      description: post.description,
      price: post.price,
      expiry_date: post.expiry_date,
    });
    setShowForm(true);
    setEditingId(post.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await API.delete(`/posts/${id}/`);
      fetchPosts();
    } catch (err) {
      alert("Error deleting post");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Your Dashboard</h1>
        <motion.button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) setEditingId(null);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg"
        >
          {showForm ? "Cancel" : "➕ Create Post"}
        </motion.button>
      </div>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-xl shadow-xl space-y-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Medicine Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              name="expiry_date"
              value={form.expiry_date}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow-lg"
            >
              {editingId ? "Update Post" : "Save"}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* User's Posts List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length === 0 ? (
          <p className="text-gray-400">You haven’t created any posts yet.</p>
        ) : (
          posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="p-6 bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transition"
            >
              <h2 className="text-xl font-semibold text-white">{post.name}</h2>
              <p className="text-gray-300 mt-2">{post.description}</p>
              <p className="text-sm text-gray-400 mt-2">
                ₹ {post.price} | 📅 {post.expiry_date}
              </p>
              <div className="flex space-x-2 mt-4">
                <motion.button
                  onClick={() => handleEdit(post)}
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1 rounded-lg bg-blue-600/80 text-white text-sm"
                >
                  Edit
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(post.id)}
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1 rounded-lg bg-red-600/80 text-white text-sm"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
