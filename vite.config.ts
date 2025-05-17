import { defineConfig } from "vite";
import commonjs from "@rollup/plugin-commonjs";
import path from "path";

export default defineConfig({
    plugins: [
        commonjs({
            include: /node_modules/,
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@@": path.resolve(__dirname, "./src/assets"),
        },
    },
});
