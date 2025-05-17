import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: "node_modules/jquery-ui-dist/jquery-ui.min.css",
                    dest: "assets/jquery-ui",
                },
                {
                    src: "node_modules/jquery-ui-dist/images/*",
                    dest: "assets/jquery-ui/images",
                },
            ],
        }),
    ],
    build: {
        assetsInLineLimit: 0, // Ensure CSS is not inlined
    },
});
