const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://sipdjd-laravel.test";

export const apiUrl = API_BASE_URL;

export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}/api/${endpoint.replace(/^\/+/, "")}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error("❌ API Response Bukan JSON:", textResponse);
      throw new Error("Response bukan JSON! Cek API di backend.");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Fetch error:", error);
    throw error;
  }
}
