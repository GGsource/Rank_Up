export const MODE: string | null = window.location.hostname.startsWith("rankup.ggsource") ? null : import.meta.env.DEV ? "Dev" : "Build";
