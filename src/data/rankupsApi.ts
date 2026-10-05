/**
 * Functions for interacting with rankups in the database
 */

import { ToastBox } from "@/components/Toast";
import { RankupData } from "@/shared/RankupData";

/**
 * Create a new RankUp based on provided information, saving it to database for future retrieval
 *
 * @param rankupData data to save of this rankup
 * @returns id of the rankup if creation was successful, otherwise null
 */
export async function createRankup(rankupData: FormData): Promise<string | null> {
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
		return null;
	}
	const rankupReturn = (await response.json()) as RankupData;
	return rankupReturn;
}

// updateRankUp(rankupId)

// deleteRankUp(rankupId)

// addNewImage(rankupId, imageData, posNdx)

// updateImage(rankupId, imageID, imageDataFields) for metadata

// deleteImage(rankupId, imageId)
