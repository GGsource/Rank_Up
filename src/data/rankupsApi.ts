/**
 * Functions for interacting with rankups in the database
 */

import { ToastBox } from "@/components/Toast";
import { RankupData } from "@/shared/RankupData";

// TODO: getRankUp(rankupId)
// TODO: updateRankUp(rankupId)
// TODO: deleteRankUp(rankupId)
// TODO: addNewImage(rankupId, posNdx)
// TODO: updateImage(rankupId, imageID) for metadata
// TODO: deleteImage(rankupId, imageId)

/**
 * Create a new RankUp based on provided information, saving it to database for future retrieval
 *
 * @param rankupData data to save of this rankup
 * @returns id of the rankup if creation was successful, otherwise null
 */
export async function createRankUp(rankupData: FormData): Promise<string | null> {
	const response = await fetch("/api/rankups", { method: "POST", body: rankupData });
	if (!response.ok) {
		ToastBox.showToast(`Failed to create new rankup: ${await response.text()}`, "Failure");
		return null;
	}
	const rankupInfo = await response.json();
	return rankupInfo.rankupId;
}

/**
 * Retrieves all info related to given rankup id
 *
 * @param rankupId id of the Rankup to retrieve
 * @returns all rankup info
 */
export async function retrieveRankup(rankupId: string): Promise<RankupData | null> {
	const response = await fetch(`/api/rankups/${rankupId}`);
	if (!response.ok) {
		ToastBox.showToast(`Failed to retrieve rankup ${rankupId}: ${await response.text()}`, "Failure");
		// FIXME: this error text is a huge HTML, should not be in an error popup
		return null;
	}
	const rankupReturn = (await response.json()) as RankupData;
	return rankupReturn;
}
