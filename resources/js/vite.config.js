import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  console.log("✅ ENV Loaded:", env);

  return {
    plugins: [react()],
    define: {
      "process.env": env,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: "react.sipdjd-laravel.test",
      port: 5173, // ✅ DEFAULT aman untuk dev server
      https: {
        key: fs.readFileSync("./certs/react.sipdjd-laravel.test-key.pem"),
        cert: fs.readFileSync("./certs/react.sipdjd-laravel.test.pem"),
      },

    },
  };
});
