  // ✅ Global flag untuk menghindari pengambilan CSRF berkali-kali
  window._csrfReady = window._csrfReady ?? false;

  /**
   * Ambil token CSRF (XSRF-TOKEN) dari cookie
   */
  const getXsrfFromCookie = () => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };

  /**
   * 🌐 Fungsi fetch utama untuk Laravel Sanctum session-based auth
   * - Hanya ambil CSRF saat login atau dipaksa
   * - Tidak ambil CSRF otomatis saat halaman refresh
   */
  export async function webFetch(endpoint, options = {}) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://sipdjd-laravel.test";
    const url = `${baseUrl.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
    const method = options.method?.toUpperCase() || "GET";
    const isFormData = options.body instanceof FormData;

    // ✅ Hanya ambil CSRF saat login atau dipaksa (forceFetchCsrf)
    if (!window._csrfReady && (options.forceFetchCsrf || endpoint === "login")) {
      console.warn("🛡️ Fetching /sanctum/csrf-cookie");
      await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      window._csrfReady = true;
    }

    const csrfToken = getXsrfFromCookie();
    const baseHeaders = {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(method !== "GET" && !isFormData && {
        "Content-Type": "application/json",
      }),
      ...(method !== "GET" && csrfToken && {
        "X-XSRF-TOKEN": csrfToken,
      }),
    };

    const finalOptions = {
      method,
      credentials: "include",
      headers: {
        ...baseHeaders,
        ...(options.headers || {}),
      },
      ...options,
    };

    try {
      const response = await fetch(url, finalOptions);
      if (!response.ok) throw response;

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        return await response.json();
      } else {
        const text = await response.text();
        console.warn("⚠️ Response bukan JSON:", text);
        return text;
      }
    } catch (err) {
      console.error("❌ Web Fetch Error:", err);
      throw err;
    }
  }
  /**
   * Ambil token CSRF (XSRF-TOKEN) dari cookie
   * @returns {string|null}
   */