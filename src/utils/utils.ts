export function getEl<ElementType extends HTMLElement = HTMLElement>(elementName: string): ElementType {
	const element = document.getElementById(elementName) as ElementType;
	if (!element) throw new Error(`Fatal Error: Failed to locate #${elementName}`);
	return element;
}
