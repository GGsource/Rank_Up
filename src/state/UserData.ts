interface UserFormData {
	title: string;
	desc: string;
	imageURLs: string[];
}

let userData: UserFormData | null = null;

export function setUserData(title: string, desc: string, imageURLs: string[]) {
	userData = { title, desc, imageURLs };
}

export function getUserData(): UserFormData | null {
	return userData;
}
