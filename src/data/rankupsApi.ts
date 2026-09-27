/**
 * Functions for interacting with rankups in the database
 */

import { ToastBox } from "@/components/Toast";

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

	// TODO: Implement me
	throw new Error("Implement proper return");
	return "";
}
