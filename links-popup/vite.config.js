import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    minify: false,
    outDir: "../dist/links-popup",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: "index.html",
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
});
