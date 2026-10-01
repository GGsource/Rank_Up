import emptyImage from "@/assets/images/icons/empty.png";

export const EMPTY_IMG = Object.assign(new Image(), {
	src: emptyImage,
});

export const MODE: string | null = window.location.hostname.startsWith("rankup.ggsource") ? null : import.meta.env.DEV ? "Dev" : "Build";

export const pageRoutes = [
	{ page: "home", path: "" },
	{ page: "form", path: "/create" },
	{ page: "rankup", path: "/rankups/:rankupId" },
	{ page: "404", path: "/404" },
] as const;

export type PageNames = (typeof pageRoutes)[number]["page"];
