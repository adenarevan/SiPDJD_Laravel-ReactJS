/**
 * 🧠 LOGIN PAGE (React + Tailwind + Laravel Sanctum + Cloudflare Turnstile)
 *
 * 🔐 FUNGSI UTAMA:
 * - Menyediakan form login (username, password)
 * - Menggunakan Cloudflare Turnstile untuk verifikasi anti-bot
 * - Mengambil CSRF token & login via Laravel Sanctum (session-based)
 * - Menyimpan data user ke context global `AuthContext`
 * - Redirect otomatis ke /dashboard jika login sukses
 *
 * 💡 POIN UTAMA:
 * - `useAuth()` → mengakses & menyimpan data user setelah login
 * - `webFetch()` → helper fetch dengan CSRF + session
 * - `turnstileRef` → untuk render captcha dari Cloudflare
 * - `useEffect()` pertama → handle load & render widget Turnstile
 * - `handleSubmit()` → urutan login:
 *    1. validasi input + token turnstile
 *    2. ambil CSRF
 *    3. POST login
 *    4. ambil user session (`/me`)
 *    5. simpan ke context dan redirect
 * - `ToastContainer` + `toast.success/error()` → notifikasi sukses/gagal
 * - `Swiper` → slideshow fullscreen untuk tampilan estetis
 *
 * ⚠️ Jangan lupa:
 * - Pastikan domain `.test` punya SSL jika pakai session-based auth
 * - Turnstile sitekey harus sesuai dengan yang diregistrasi di Cloudflare
 */


import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";
import axios from "axios";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { webFetch } from "@/utils/webFetch";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router-dom";



const slides = [
  "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&h=1080&fit=crop"
];

export default function Login() {
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cfResponse, setCfResponse] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const turnstileRef = useRef(null);
  const turnstileInitialized = useRef(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
const { user, authChecked, setUser } = useAuth();


  const navigate = useNavigate(); // ← tambahkan ini juga

  const getXsrfFromCookie = () => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };




useEffect(() => {
  const params = new URLSearchParams(location.search);
  if (params.get("logout") === "1") {
    toast.success("✅ Logout sukses!");
    // opsional: hapus ?logout=1 dari URL
    window.history.replaceState({}, document.title, "/login");
  }
}, [location.search]);

  useEffect(() => {
    // Define global callback functions for Turnstile
    window.onTurnstileSuccess = (token) => {
      console.log("✅ Turnstile Token Diterima:", token);
      setCfResponse(token);
    };
    
    window.onTurnstileExpired = () => {
      console.log("⚠️ Turnstile Expired, Resetting...");
      setCfResponse("");
    };
    
    // Function to load Turnstile script safely
    const loadTurnstileScript = () => {
      // Check if script already exists
      const existingScript = document.querySelector('script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]');
      if (existingScript) {
        return Promise.resolve();
      }
      
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad";
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };
    
    // Callback when script is loaded
    window.onTurnstileLoad = () => {
      if (turnstileRef.current && !turnstileInitialized.current && window.turnstile) {
        // Clear any existing widget
        turnstileRef.current.innerHTML = '';
        
        try {
          window.turnstile.render(turnstileRef.current, {
            sitekey: "0x4AAAAAAA-_oiI09gOh5_vx",
            callback: window.onTurnstileSuccess,
            'expired-callback': window.onTurnstileExpired
          });
          
          turnstileInitialized.current = true;
          console.log("✅ Turnstile widget rendered successfully");
        } catch (err) {
          console.error("Failed to render Turnstile widget:", err);
        }
      }
    };
    
    loadTurnstileScript()
      .then(() => {
        // If window.turnstile is already available, render immediately
        if (window.turnstile && turnstileRef.current && !turnstileInitialized.current) {
          window.onTurnstileLoad();
        }
      })
      .catch(err => {
        console.error("Failed to load Turnstile script:", err);
        setError("Gagal memuat Cloudflare Turnstile. Silakan muat ulang halaman.");
      });
    
    // Cleanup function
    return () => {
      delete window.onTurnstileSuccess;
      delete window.onTurnstileExpired;
      delete window.onTurnstileLoad;
      turnstileInitialized.current = false;
    };
  }, []);

  const resetTurnstile = () => {
    if (window.turnstile && turnstileInitialized.current) {
      try {
        window.turnstile.reset();
        setCfResponse("");
      } catch (err) {
        console.error("Failed to reset Turnstile:", err);
      }
    }
  };

    useEffect(() => {
    if (authChecked && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [authChecked, user]);

  if (!authChecked) return null;
  if (authChecked && user) return null;
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Submit diklik");
  
    if (!username || !password) {
      toast.error("Username dan password tidak boleh kosong");
      return;
    }
  
    if (!cfResponse) {
      toast.error("❌ Verifikasi Cloudflare belum selesai, silakan coba lagi.");
      resetTurnstile();
      return;
    }
  
    setIsLoading(true);
    setError("");
  
    try {
      // console.log("🔐 Ambil CSRF cookie");
      // await webFetch("sanctum/csrf-cookie", { forceFetchCsrf: true }); // ⬅️ Tambahkan ini!
    
    
      console.log("📨 Kirim login request");
      const res = await webFetch("login", {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
          "cf-turnstile-response": cfResponse,
        }),
      });
  
      console.log("✅ Login berhasil:", res);
  
      const user = res?.user;
      if (!user?.fullName) {
        throw new Error("Login gagal: Data user tidak ditemukan.");
      }
  
      toast.success(`✅ Selamat datang, ${user.fullName}!`);
  
      // 🔥 Setelah login, cek session dengan /me
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log("🔄 Cek session dengan /me...");
      const me = await webFetch("me");
      setUser(me.user); // ✅ Ini hasil session yang valid dari backend
      

      // 🚀 Arahkan ke dashboard
      navigate("/dashboard");
  
    } catch (err) {
      console.error("🧨 ERROR LOGIN:", err);
  
      // Clear cookie kalau error
      document.cookie = 'XSRF-TOKEN=; Max-Age=0; path=/; domain=.sipdjd-laravel.test; secure';
      document.cookie = 'laravel_session=; Max-Age=0; path=/; domain=.sipdjd-laravel.test; secure';
  
      let message = "🚨 Terjadi kesalahan saat login.";
  
      const status = err?.status || err?.response?.status;
      if (status === 404) message = "❌ Endpoint login tidak ditemukan (404).";
      else if (status === 403) message = "⚠️ Verifikasi Cloudflare gagal.";
      else if (status === 401) message = "❌ Username atau password salah.";
      
      try {
        const response = err instanceof Response ? err : err.response;
        const data = await response.json();
        if (data?.message) message = `❌ ${data.message}`;
      } catch (_) {
        console.warn("⚠️ Gagal parsing error response JSON");
      }
  
      setError(message);
      toast.error(message);
      resetTurnstile();
    } finally {
      setIsLoading(false);
    }
  };
  

  
  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white font-sans overflow-hidden">
      {/* <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // ✅ Toast jadi background putih
      /> */}
      
      {/* Left side - image carousel (hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 items-center justify-center overflow-hidden shadow-xl relative">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop={true}
          className="w-full h-full"
        >
          {slides.map((src, index) => (
            <SwiperSlide key={index} className="flex items-center justify-center w-full h-full">
              <motion.img 
                initial={{ opacity: 0.8, scale: 1 }}
                animate={{ opacity: 1, scale: 1.05 }}
                transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
                src={src} 
                alt={`Slide ${index + 1}`} 
                className="w-full h-full object-cover brightness-75"
                onError={(e) => {
                  console.error(`Failed to load image: ${src}`);
                  e.target.src = "https://via.placeholder.com/1920x1080?text=Image+Not+Found";
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold text-yellow-400 uppercase tracking-wider text-center mb-4"
          >
            PUPR - Infrastruktur
          </motion.h1>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-24 h-1 bg-yellow-500 rounded-full mb-6"
          />
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl text-gray-300 max-w-md text-center"
          >
            Kementerian Pekerjaan Umum dan Perumahan Rakyat
          </motion.p>
        </div>
      </div>
      
      {/* Right side - login form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 md:p-12 h-screen relative">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500 rounded-full filter blur-3xl opacity-5"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500 rounded-full filter blur-3xl opacity-5"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
           className="bg-gray-800 p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 backdrop-filter backdrop-blur-xl bg-opacity-80 relative overflow-hidden"
        >
          {/* Top accent stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"></div>
          
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 360 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </motion.div>
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-2 text-yellow-400 uppercase tracking-wide">WEB - PUPR</h2>
          <p className="text-center text-gray-400 mb-8">Sistem Infrastruktur PUPR</p>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-center mb-4 bg-red-900 bg-opacity-20 p-3 rounded-lg border border-red-800"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-gray-300 mb-2 text-base font-medium">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-500" />
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-700 focus:border-yellow-500 rounded-lg bg-gray-800 text-white placeholder-gray-500 transition duration-300"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 mb-2 text-base font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-500" />
                <input 
                  type="password"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-700 focus:border-yellow-500 rounded-lg bg-gray-800 text-white placeholder-gray-500 transition duration-300"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-6 flex justify-center">
              <div 
                ref={turnstileRef}
                className="turnstile-container"
              ></div>
            </div>

            

            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 py-3 rounded-lg font-bold transition duration-300 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </>
              ) : "Login"}
            </motion.button>
          </form>
          
          <p className="text-center text-gray-500 text-sm mt-6">
            © {new Date().getFullYear()} Kementerian PUPR. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}