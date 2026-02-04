import axios from "axios";

const API = axios.create({
  baseURL: "https://todo2-1-olmw.onrender.com"
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
