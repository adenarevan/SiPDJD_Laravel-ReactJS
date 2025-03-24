import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // ⬅️ pastikan kamu import ini

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  console.log("✅ ENV Loaded:", env); // Debugging

  return {
    plugins: [react()],
    define: {
      "process.env": env,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    
    server: {
      proxy: {
        "/api": env.VITE_API_BASE_URL || "http://localhost:8000",
      },
    },
  };
});

