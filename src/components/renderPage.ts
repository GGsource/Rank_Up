import { PageClass } from "@/pages/Page";
import { getEl } from "@/utils/utils";

const pageRegistry = new Map<string, PageClass>();

/**
 * Registers the given page in our known map
 *
 * @param pageName Name of the page
 * @param pageClass Class of the Page
 */
export function registerPage(pageName: string, pageClass: PageClass) {
	pageRegistry.set(pageName, pageClass);
}

/**
 * Attaches the given page to the container to display it
 *
 * @param pageName name of the page to show
 */
export async function renderPage(pageName: string, pushState = true) {
	// Get the container
	const pageContainer = getEl("page-container");

	// Import appropriate render function
	const pageKey = pageName.toLowerCase();
	if (!pageRegistry.has(pageKey)) {
		try {
			await import(`../pages/${pageKey}/${pageKey}.ts`);
		} catch (err) {
			console.error(`Fatal Error: Failed to import ${pageKey}`);
			throw err;
		}
	}

	// Mount the page
	const pageClass = pageRegistry.get(pageKey);
	if (!pageClass) {
		pageContainer.innerHTML = "I didn't find shit!!! Fuh 😩";
		throw new Error(`Fatal Error: Page ${pageKey} imported but never registered.`);
	}
	pageClass.mountTo(pageContainer);

	if (pushState) {
		const path = window.location.pathname.replace(/\/+$/, "");
		history.pushState(null, "", path);
	}
}

/**
 *
 * @param pushState whether or not to push a new state to browser
 */
export function renderPath(pushState = true) {
	let page = "home";
	const path = window.location.pathname.replace(/\/+$/, "");
	switch (path) {
		case "":
			break;
		case "/create":
			page = "form";
			break;
		// FIXME: clicking new form button does not navigate to site.com/create and nav history doesnt work
		default:
			page = "404";
			pushState = false;
			break;
	}
	renderPage(page, pushState);
}
