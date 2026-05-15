import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react"; // ✅ changed here
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const envDefine: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  return {
    base: env.VITE_BASE_PATH || "/",

    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },

    define: envDefine,

    plugins: [react(), mode === "development" && componentTagger()].filter(
      Boolean,
    ),

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
  };
});
