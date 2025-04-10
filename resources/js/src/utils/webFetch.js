export async function webFetch(endpoint, options = {}) {
  const baseUrl = "http://localhost:8000"; // Ganti kalau beda
  const url = `${baseUrl}/${endpoint}`;

  const finalOptions = {
    method: "GET",
    credentials: "include", // ✅ WAJIB UNTUK KIRIM COOKIE!
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, finalOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("❌ Web Fetch Error:", err);
    throw err;
  }
}
