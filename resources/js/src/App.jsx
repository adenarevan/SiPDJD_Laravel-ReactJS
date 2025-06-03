// 📦 Import React Router dan komponen halaman
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useState } from "react";

// 🧱 Import layout dan halaman utama
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SkPage from "./pages/SkPage";
import DD1Page from "./pages/DD1Page";

// 🔔 Import Toast notification
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🔐 Import context global untuk autentikasi
import { useAuth } from "@/context/AuthContext";

// 🧩 Layout utama dengan Sidebar, Navbar, Footer
function Layout({ isOpen, toggleSidebar }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        <main className={`flex-1 pt-16 ${isOpen ? "pl-64" : "pl-20"} p-4 overflow-auto`}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

// 🛡 Komponen wrapper untuk halaman yang butuh login
function ProtectedRoute({ children }) {
  const { user, authChecked } = useAuth();

  // ⏳ Tahan render sampai pengecekan selesai
  if (!authChecked) return null;

  // ✅ Jika sudah login tampilkan anaknya, jika tidak arahkan ke login
  return user ? children : <Navigate to="/login" />;
}

// 🔧 Komponen utama aplikasi
export default function App() {
  const [isOpen, setIsOpen] = useState(true); // sidebar toggle
  const { user, authChecked } = useAuth(); // ambil status auth global

  if (!authChecked) return null; // ⏳ Jangan render sebelum pengecekan auth selesai

  return (
    <Router>
      {/* 🔔 Container notifikasi global */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* 🛣️ Definisikan semua route */}
      <Routes>
        {/* ⛔ Redirect root ke login atau dashboard tergantung status login */}
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />

        {/* 🔐 Halaman login bebas diakses */}
        <Route path="/login" element={<Login />} />

        {/* 🧱 Halaman yang dibungkus oleh layout + hanya bisa diakses kalau sudah login */}
        <Route
          element={
            <ProtectedRoute>
              <Layout isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />
            </ProtectedRoute>
          }
        >
          {/* 🏠 Halaman utama dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* 📄 Halaman untuk verifikasi SK */}
          <Route path="/data-teknis/sk" element={<SkPage />} />
          <Route path="/data-teknis/dd1" element={<DD1Page />} />

        </Route>

        {/* ❌ Route tidak dikenal → arahkan ke login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
