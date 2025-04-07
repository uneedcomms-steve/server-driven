// @ts-nocheck
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src")
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: "build",
    sourcemap: true
  },
  // 정적 파일을 public 디렉토리에서 제공하기 위한 설정
  publicDir: "public"
});
