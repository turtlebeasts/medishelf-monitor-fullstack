import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { motion } from "framer-motion";

export default function Chat() {
  const { id } = useParams(); // conversation id
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await API.get(`/messages/?conversation=${id}`);
      setMessages(res.data.results || res.data); // DRF pagination safe
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await API.post("/messages/", { conversation: id, text });
      setText("");
      fetchMessages();
    } catch (err) {
      console.error("Error sending message", err);
      alert("Error sending message");
    }
  };

  const username = localStorage.getItem("username");

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 p-4 scrollbar-thin scrollbar-thumb-gray-700">
        {messages.map((msg, i) => {
          const isMe = msg.sender?.username === username;
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 max-w-xs rounded-2xl shadow ${
                  isMe
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none"
                    : "bg-gray-800 text-gray-100 rounded-bl-none"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <span className="text-xs text-gray-300 block mt-1 text-right">
                  {msg.sender?.username}
                </span>
              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center p-3 border-t border-gray-800 bg-gray-900"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          type="submit"
          className="ml-3 px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg"
        >
          Send
        </motion.button>
      </form>
    </div>
  );
}
