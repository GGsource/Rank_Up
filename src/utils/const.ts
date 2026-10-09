import emptyImage from "@/assets/images/icons/empty.png";

export const EMPTY_IMG = Object.assign(new Image(), {
	src: emptyImage,
});

// Whether we're running in dev mode, build preview mode, or on the actual main website
export const MODE: string | null = window.location.hostname.startsWith("rankup.ggsource") ? null : import.meta.env.DEV ? "Dev" : "Build";

// Whether we should be running with a local database or a remote one
const isLocal = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
export const imagesEndpoint = isLocal ? `/api/images` : `https://img.ggsource.dev`;

// All valid page routes and their paths
export const pageRoutes = [
	{ page: "home", path: "" },
	{ page: "form", path: "/create" },
	{ page: "placeholders", path: "/rankups/placeholders" },
	{ page: "rankup", path: "/rankups/:rankupId" },
	{ page: "404", path: "/404" },
] as const;

// A type derived from pageRoutes that limits options to existing page names
export type PageNames = (typeof pageRoutes)[number]["page"];
