interface UserFormData {
	title: string;
	desc: string;
	imageFiles: File[];
}

let userData: UserFormData | null;

export function setUserData(title: string, desc: string, imageFiles: File[]) {
	userData = { title, desc, imageFiles };
}

export function getUserData(): UserFormData | null {
	return userData;
}
