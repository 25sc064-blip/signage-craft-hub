import path from "path";
import { defineConfig, loadEnv } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode`
  const env = loadEnv(mode, process.cwd(), "");

  // Optional: define env vars for direct replacement
  const envDefine: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  return {
    // Base path support (example: /myapp/)
    base: env.VITE_BASE_PATH || "/",

    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },

    define: envDefine,

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

    plugins: [
      tailwindcss(),
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tanstackStart(),
      viteReact(),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
  };
});
