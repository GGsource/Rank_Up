import { registerPage } from "@/components/renderPage";
import { RankUpPage } from "../rankup/rankup";
import { getPresetByIndex } from "@/utils/ListPresets";
import { Row } from "@/components/Row";

/**
 * Placeholders class extending the regular Rankups page. Identical except overriding initializeData function to prevent db fetch
 */
class RankupPlaceholders extends RankUpPage {
	protected initializeData(urlParams: Record<string, string>) {
		/* ------------------------------ Set text data ----------------------------- */
		this.headerTitle.value = "Placeholders Rankup";
		this.setTitle(this.headerTitle.value);
		this.headerDescription.value =
			"This is the placeholders rankup list.\nThis is a pre-populated set of images for testing functionality without touching the database.";
		/* ------------------------------- Attach rows ------------------------------ */
		const chosenPreset = getPresetByIndex[0];
		for (const row of chosenPreset.rows) this.rowList.append(new Row(this, row.rowName, row.rowColor));
		/* ------------------------------ Insert images ----------------------------- */
		const placeholderImages = import.meta.glob("../../assets/images/placeholders/*.png", { eager: true, import: "default" });
		Object.values(placeholderImages).forEach((name) => this.addImageToContainer(name as string));
	}
}
// Register this page to the renderer
registerPage("placeholders", RankupPlaceholders);
