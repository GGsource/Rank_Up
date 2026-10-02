import { PageClass } from "@/pages/Page";
import { PageNames, pageRoutes } from "@/utils/const";
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

// DOCS:
export function renderRankup(rankupId: string) {
	renderPage("rankup", `/rankups/${rankupId}`, { rankupId: rankupId });
}

/**
 * Attaches the given page to the container to display it
 *
 * @param pageName name of the page to show
 */
export async function renderPage(
	page: PageNames,
	path: string | undefined = pageRoutes.find((route) => route.page === page)?.path,
	args: Record<string, string> = {},
	pushState = true,
) {
	// Get the container
	const pageContainer = getEl("page-container");

	// Import appropriate render function
	if (!pageRegistry.has(page)) {
		try {
			await import(`../pages/${page}/${page}.ts`);
		} catch (err) {
			console.error(`Fatal Error: Failed to import ${page}`);
			throw err;
		}
	}

	// Mount the page
	const pageClass = pageRegistry.get(page);
	if (!pageClass) {
		pageContainer.innerHTML = "I didn't find shit!!! Fuh 😩";
		throw new Error(`Fatal Error: Page ${page} imported but never registered.`);
	}
	pageClass.mountTo(pageContainer, args);

	if (pushState) {
		if (path == undefined) throw new Error("Received undefined path :(");
		history.pushState(null, "", path);
	}
}

/**
 * Called when user navigates directly to a directory on the site, this parses where to take them
 *
 * @param pushState whether or not to push a new state to browser
 */
export function parseUrl(pushState = true) {
	// Grab from URL
	const userPath = window.location.pathname.replace(/\/+$/, "");
	const pathParts = userPath.split("/");
	// Set defaults in case we don't find it.
	let page: PageNames = "404";
	let pageArgs: Record<string, string> = {};
	let path = "/404";
	// Find which page the user is actually trying to navigate to
	for (const route of pageRoutes) {
		const routeParts = route.path.split("/");
		if (
			routeParts.length != pathParts.length || // Mismatch of directory count, skip
			(routeParts.length > 1 && routeParts[1].toLowerCase() !== pathParts[1].toLowerCase()) // Root page present and mistmatched
		) {
			continue; // Skip this one
		}
		// We found a match
		page = route.page;
		path = `/${pathParts.slice(1).join("/")}`;

		// Check for any arguments on path
		routeParts.forEach((part, ndx) => {
			if (part.startsWith(":")) {
				// This is a URL argument
				pageArgs[part.slice(1)] = pathParts[ndx];
			}
		});
		break;
	}

	renderPage(page, path, pageArgs, pushState);
}

// TODO: Before submitting this PR, ensure these migrations are applied to the REMOTE database, not just local. Attempt form creation in branch URL
// TODO: Check if upgrade dev/build mode story exists, if not, make one. Should expand mode from "Build" to be Preview, maybe with the branch name or something in there
