import { MODE } from "@/utils/const";

/**
 * Defines the shape of a Page subclass extending Page
 */
export interface PageClass {
	mountTo(container: HTMLElement): Page;
	rawHTML: string;
}

/**
 * The abstract class for all pages on this site grouping information common to all
 */
export abstract class Page {
	/**
	 * Sets the window's tab title
	 *
	 * @param tabTitle title to set
	 */
	setTitle(tabTitle: string) {
		document.title = (MODE ? `${MODE}: ` : "") + `${tabTitle} - RankUp`;
	}

	/**
	 * Takes a target element and populates it with the raw HTML for this page and instantiates it
	 *
	 * @param mountingTarget Element onto which to mount this page
	 * @returns the created instance of this class that has been mounted
	 */
	static mountTo<T extends Page>(this: { new (): T; rawHTML: string }, mountingTarget: HTMLElement): T {
		mountingTarget.innerHTML = this.rawHTML;
		return new this();
	}
}
