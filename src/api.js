import axios from "axios";

const API = axios.create({
  baseURL: "https://todo2-nijx.onrender.com/api"
});

// Attach JWT token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = token;
  }
  return req;
});

export default API;
