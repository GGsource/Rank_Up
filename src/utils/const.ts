import emptyImage from "@/assets/images/icons/empty.png";

export const EMPTY_IMG = Object.assign(new Image(), {
	src: emptyImage,
});

export const MODE: string | null = window.location.hostname.startsWith("rankup.ggsource") ? null : import.meta.env.DEV ? "Dev" : "Build";

export const canonicalNavPaths = {
	home: "",
	form: "/create",
	"404": "404",
	rankup: "rankups=instance",
	// This last one currently cannot be navigated back and forth from
	// as it is an instance. Future story will fix this by implementing
	// unique URLs for each rankup.
};

export type pageNames = keyof typeof canonicalNavPaths;
