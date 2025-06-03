const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://sipdjd-laravel.test";

export async function getCsrfToken() {
  // ⛔ Jangan ambil dari /get-csrf, cukup fetch Sanctum endpoint
  try {
    await fetch(`${baseUrl.replace(/\/+$/, '')}/sanctum/csrf-cookie`, {
      credentials: "include",
    });
    console.log("✅ CSRF token di-fetch dari Sanctum");
  } catch (error) {
    console.error("❌ Gagal fetch CSRF token:", error);
  }
}
