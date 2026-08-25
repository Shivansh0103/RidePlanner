import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("node_modules")) {
            if (id.includes("@mui") || id.includes("@emotion")) {
              return "vendor-mui";
            }
            if (
              id.includes("react-router-dom") ||
              id.includes("/react/") ||
              id.includes("/react-dom/")
            ) {
              return "vendor-react";
            }
            if (id.includes("@vis.gl")) {
              return "vendor-maps";
            }
            if (id.includes("@tanstack")) {
              return "vendor-query";
            }
            if (id.includes("@dnd-kit")) {
              return "vendor-dnd";
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    isolate: false,
    fileParallelism: false,
  },
});