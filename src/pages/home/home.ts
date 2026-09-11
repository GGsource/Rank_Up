import homeHTMLRaw from "./home.html?raw";
import "./home.css";
import plusIconImage from "@/assets/images/icons/plus.png";
import { registerPage, renderPage } from "@/components/renderPage";
import { getEl } from "@/utils/utils";
import { Page } from "../Page";

class HomePage extends Page {
	static rawHTML = homeHTMLRaw;

	constructor() {
		super();
		this.setTitle();
		/* ------------------------------ Insert icons ------------------------------ */
		const plusIconElement = getEl<HTMLImageElement>("icon-plus");
		plusIconElement.src = plusIconImage;
		/* ----------------------- Attach new rankup listener ----------------------- */
		const newRankUpBtn = getEl("create-new-rankup-card");
		newRankUpBtn.addEventListener("click", () => renderPage("form"));
	}
}

// Register this page to the renderer
registerPage("home", HomePage);
