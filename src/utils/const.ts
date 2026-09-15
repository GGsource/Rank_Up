import emptyImage from "@/assets/images/icons/empty.png";

export const EMPTY_IMG = Object.assign(new Image(), {
	src: emptyImage,
});

export const MODE: string | null = window.location.hostname.startsWith("rankup.ggsource") ? null : import.meta.env.DEV ? "Dev" : "Build";
