import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@client": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attachedAssets"),
    },
  },
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: true,
    port: 3000,
    allowedHosts: [
      "9d03bad2-198f-4b32-ba3a-c53ebc6f14fc-00-1f5ppxz0b9kiw.worf.replit.dev",
    ],
    fs: {
      strict: true,
    },
  },
});
