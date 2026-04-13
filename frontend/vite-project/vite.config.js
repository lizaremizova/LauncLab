import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import {fileURLToPath} from "node:url";
// https://vite.dev/config/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default defineConfig({
    plugins: [react(), tailwindcss()],
    css: {
        devSourcemap: true,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        manifest: true,
        outDir: '../../public/build',
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        watch: {
            usePolling: true,
            interval: 1000,
        },
        hmr: {
            host: 'localhost',
        },
    }
})

