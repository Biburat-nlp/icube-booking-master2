/// <reference types="vitest" />

import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import viteBasicSslPlugin from "@vitejs/plugin-basic-ssl";
import legacy from "@vitejs/plugin-legacy";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [
            react(),
            viteBasicSslPlugin(),
            svgr(),
            legacy(),
        ],

        server: {
            cors: true,
            port: 9000,
            open: true,
            proxy: {
                "/api": {
                    target: env.VITE_API_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                },
            },
        },

        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
    };
});
