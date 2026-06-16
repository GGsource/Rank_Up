// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
	server: {
		open: true, // This opens the browser automatically
	},
	base: "/", // This ensures our site works with our custom domain.
});
