// utils/forceLogout.js
import { toast } from "react-toastify";

export function forceLogout() {
  document.cookie = 'XSRF-TOKEN=; Max-Age=0; path=/; domain=.sipdjd-laravel.test; secure';
  document.cookie = 'laravel_session=; Max-Age=0; path=/; domain=.sipdjd-laravel.test; secure';

  localStorage.clear();
  sessionStorage.clear();

  toast.info("👋 Sesi habis. Silakan login ulang.", {
    position: "top-right",
    autoClose: 3000,
  });

  setTimeout(() => {
    window.location.href = "/login";
  }, 1000);
}
