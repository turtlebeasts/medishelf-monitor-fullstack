import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Feed from "./pages/Feed";
import PostDetails from "./pages/PostDetails";
import Chat from "./pages/Chat";
import ConversationsList from "./pages/ConversationsList";

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={<Login onLogin={() => setLoggedIn(true)} />}
        />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Private Pages */}
      <Route element={loggedIn ? <PrivateLayout /> : <Navigate to="/login" />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/conversations" element={<ConversationsList />} />
      </Route>
    </Routes>
  );
}

export default App;
