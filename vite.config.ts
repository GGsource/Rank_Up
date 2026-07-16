/* -------------------------------------------------------------------------- */
/*                               vite.config.js                               */
/* -------------------------------------------------------------------------- */

import { defineConfig } from "vite";
import { fileURLToPath } from "url";

export default defineConfig({
	server: {
		open: true, // This opens the browser automatically
	},
	base: "/", // This ensures our site works with our custom domain.
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
});
