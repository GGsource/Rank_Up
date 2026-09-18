import notFoundHTMLRaw from "./404.html?raw";
// import "./404.css";
import { registerPage } from "@/components/renderPage";
import { Page } from "../Page";
import { getEl } from "@/utils/utils";

class NotFoundPage extends Page {
	static rawHTML = notFoundHTMLRaw;

	constructor() {
		super();
		this.setTitle("Lost Girl");
		const nfBody = getEl("404-body");
		const path = window.location.pathname.replace(/\/+$/, "");
		nfBody.innerText = `No page exists by the name of ${path}`;
	}
}

// Register this page to the renderer
registerPage("404", NotFoundPage);
