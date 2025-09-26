// api.js
import axios from "axios";

const API = axios.create({ baseURL: "http://127.0.0.1:8000/api" });

const PUBLIC_PATHS = [
  "/auth/register/",
  "/auth/token/",
  "/auth/token/refresh/",
];

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  const isPublic = PUBLIC_PATHS.some((p) => req.url?.endsWith(p));
  if (token && token !== "null" && token !== "undefined" && !isPublic) {
    req.headers.Authorization = `Bearer ${token}`;
  } else {
    delete req.headers.Authorization;
  }
  return req;
});

export default API;
