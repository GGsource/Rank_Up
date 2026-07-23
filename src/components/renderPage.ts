type RenderFunction = (container: HTMLElement) => void;
const pageRegistry = new Map<string, RenderFunction>();

export function registerPage(pageName: string, func: RenderFunction) {
	pageRegistry.set(pageName, func);
}

export async function renderPage(pageName: string) {
	// Get the container
	let pageContainer = document.getElementById("page-container");
	if (!pageContainer) throw new Error("Fatal Error: Failed to fetch #page-container, cannot render page.");

	// Import appropriate render function
	const pageKey = pageName.toLocaleLowerCase();
	if (!pageRegistry.has(pageKey)) {
		try {
			await import(`../pages/${pageKey}/${pageKey}.ts`);
		} catch (err) {
			console.error(`Fatal Error: Failed to import @/pages/${pageKey}/${pageKey}`);
			throw err;
		}
	}

	// Call the render function
	const renderFunc = pageRegistry.get(pageKey);
	if (!renderFunc) {
		pageContainer.innerHTML = "I didn't find shit!!! Fuh 😩";
		throw new Error(`Fatal Error: Page ${pageKey} imported but never registered.`);
	}
	renderFunc(pageContainer);
}
