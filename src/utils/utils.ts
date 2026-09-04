/**
 * Gets the element specified and does check to make sure its valid. Casts to specific element type if provided.
 *
 * @param elementName the ID of the element to fetch
 * @returns the element specified
 */
export function getEl<ElementType extends HTMLElement = HTMLElement>(elementName: string): ElementType {
	const element = document.getElementById(elementName) as ElementType;
	if (!element) throw new Error(`Fatal Error: Failed to locate #${elementName}`);
	return element;
}
