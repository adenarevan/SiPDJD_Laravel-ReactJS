import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SkPage from "./pages/SkPage"; // Halaman SK



function Layout({ isOpen, toggleSidebar }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        
        <main
          className={`flex-1 pt-16 ${isOpen ? "pl-64" : "pl-20"} p-4 overflow-auto`}
        >
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}


export default function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [authChecked, setAuthChecked] = useState(false); // ✅ new

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setAuthChecked(true); // ✅ render setelah dicek
  }, []);

  if (!authChecked) return null; // ✅ jangan render dulu sebelum dicek

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />

        {isAuthenticated && (
          <Route element={<Layout isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/data-teknis/sk" element={<SkPage />} />
          </Route>
        )}

        {!isAuthenticated && <Route path="*" element={<Navigate to="/" />} />}
      </Routes>
    </Router>
  );
}
