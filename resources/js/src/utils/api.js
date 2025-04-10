const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "xxx";

//console.log("🔥 API Base URL yang digunakan:", API_BASE_URL); // Debugging

export const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";


export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}/api/${endpoint.replace(/^\/+/, "")}`;

  // console.log(`🔗 Request API: ${url}`); // Debugging
  // console.log("XXXX API Base URL yang digunakan:", import.meta.env.VITE_API_BASE_URL);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
    });

    //console.log("🔄 API Response Status:", response.status); // Debugging

    // Cek apakah response mengandung JSON
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
