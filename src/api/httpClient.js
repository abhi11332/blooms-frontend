import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? "https://blooms-backend-i36k.onrender.com"
    : "http://localhost:8080");

const httpClient = axios.create({
  baseURL: API_BASE
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default httpClient;
