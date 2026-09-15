import { ListPresets } from "@/utils/ListPresets";

interface UserFormData {
	title: string;
	desc: string;
	imageURLs: string[];
	listPreset: ListPresets;
}

let userData: UserFormData | null = null;

export function setUserData(title: string, desc: string, imageURLs: string[], listPreset: ListPresets) {
	userData = { title, desc, imageURLs, listPreset };
}

export function getUserData(): UserFormData | null {
	return userData;
}
