/**
 * Page Class is to be extended by other pages. Provides ability to retrieve elements.
 */
export abstract class Page {
	getEl<ElementType extends HTMLElement = HTMLElement>(elementName: string): ElementType {
		const element = document.getElementById(elementName) as ElementType;
		if (!element) throw new Error(`Fatal Error: Failed to locate #${elementName}`);
		return element;
	}
}
