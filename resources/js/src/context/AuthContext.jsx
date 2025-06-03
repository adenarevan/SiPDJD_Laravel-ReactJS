// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import { webFetch } from "@/utils/webFetch";

// Membuat Context global untuk menyimpan data autentikasi user
const AuthContext = createContext();

/**
 * 🧠 Komponen utama provider Auth
 * Membungkus seluruh aplikasi agar state user bisa diakses global melalui Context
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await webFetch("me");
        setUser(res.user || res.data || null);
      } catch {
        setUser(null);
      } finally {
        setAuthChecked(true);
      }
    };
    init();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, authChecked }}>
      {authChecked ? children : null}
    </AuthContext.Provider>
  );
}

/**
 * ✅ Custom Hook untuk menggunakan Auth Context
 */
export function useAuth() {
  return useContext(AuthContext);
}
