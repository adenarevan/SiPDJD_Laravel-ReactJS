import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // 🚀 Jangan pakai "/api"

const axiosInstance = axios.create({
  baseURL: API_BASE_URL, // ✅ Harus tanpa "/api" agar bisa akses "/sanctum/csrf-cookie"
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

export default axiosInstance;

