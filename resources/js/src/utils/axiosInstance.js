import axios from "axios";

// Ambil base URL dari .env (atau fallback ke HTTPS Laravel)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://sipdjd-laravel.test";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL.replace(/\/+$/, ''), // ✅ hapus slash akhir
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // ✅ penting agar cookie Laravel dikirim
});

export default axiosInstance;
