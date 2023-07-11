import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
const path = require("path");
import wasm from "vite-plugin-wasm";
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "src")
      }
    ]
  },
  plugins: [vue(), wasm()],
  build: {
    minify: "terser",
    brotliSize: false,
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
