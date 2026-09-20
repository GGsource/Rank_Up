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
	const newRankUpId = await fetch("/api/rankups", { method: "POST", body: rankupData });
	if (!newRankUpId.ok) {
		ToastBox.showToast("Error: Failed to create new rankup!", "Failure");
		return null;
	}

	// TODO: Implement me
	throw new Error("Implement proper return");
	return "";
}
