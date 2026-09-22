export default {
	async fetch(request: Request, env: Env) {
		const url = new URL(request.url);
		if (url.pathname.startsWith("/api/")) {
			if (url.pathname === "/api/rankups" && request.method === "POST") {
				// POST to make a new rankup entry in table
				/**
				 * Functions here are called when the user makes a rankup request without the need of a specific ID
				 */
				// TODO: Move me to a separate function below?
				const rankupData = await request.formData();
				const rankupImages = rankupData.getAll("rankupImages"); // TODO: Make sure this is File objects

				// First insert images into the R2 bucket
				let r2Keys: string[] = [];
				try {
					await Promise.allSettled(
						rankupImages.map((rankupImage) => {
							const newKey = crypto.randomUUID();
							r2Keys.push(newKey);
							env.RANKUP_BUCKET.put(newKey, rankupImage);
						}),
					);
				} catch (err) {
					// Failed to insert all images, remove any that might be orphaned
					await Promise.allSettled(r2Keys.map((key) => env.RANKUP_BUCKET.delete(key)));
					return new Response("Failed to upload images to R2 Bucket", { status: 503 });
				}

				// Now insert rankup into rankups table
				try {
					// Validate the data's shape is as required
					let rankUpShape: RankUpShape = {
						title: getFormString(rankupData, "title"),
						desc: getOptionalFormString(rankupData, "desc"),
						listPreset: getFormNumber(rankupData, "listPreset"),
					};

					// Shape is correct, so let's insert
					let statement = env.RANKUP_DB.prepare(":D my queryyyy");
					statement.bind(rankUpShape.title, rankUpShape.desc, rankUpShape.listPreset); // give the statement my variables
					// TODO: Ensure null can ACTUALLY be received for description AND gets saved to the db
					const result = statement.run();
					// NOTE: If this was successful, result should now contain my new ID
					// TODO: Retrieve this ID for use in the next step
					// TODO: Catch if the statement failed to run. result should have an "ok" equivalent
				} catch (error) {
					const message = error instanceof Error ? error.message : "Unknown validation error";
					return new Response(`Failed to insert rankup into database: ${message}`, { status: 400 });
				}

				if (request.body) {
					// If image insertion was successful, we can now create a new entry in the rankup table
					// env.DB.prepare()
					// env.DB.exec()
					// If our rankup was sucessfully created, now save the image information to the rankup_images table
					// env.DB.prepare()
					// env.DB.exec()
					const newRankUpId = ""; // TODO: Actually get it back from db
					return Response.json({ rankupId: newRankUpId }, { status: 201 });
				}
				return new Response("Failed to insert: Error here", { status: -999 }); // TODO: Check what the appropriate thing to send here is
			}
			return new Response("Not Found", { status: 404 }); // requested path not found
		}
		return env.RANKUP_ASSETS.fetch(request); // non-api call, fallback
	},
};

// Shape of the received rankup data
interface RankUpShape {
	title: string;
	desc: string | null;
	listPreset: number;
}

function getFormString(formData: FormData, fieldName: string): string {
	const field = formData.get(fieldName);
	if (typeof field !== "string") {
		throw new Error(`${fieldName} is required and must be a string`);
	}
	return field;
}
function getOptionalFormString(formData: FormData, fieldName: string): string | null {
	const field = formData.get(fieldName);
	if (field instanceof File) {
		throw new Error(`${fieldName} is should be either a string or null`);
	}
	return field;
}
function getFormNumber(formData: FormData, fieldName: string): number {
	const field = formData.get(fieldName);
	const fieldNum = Number(field);
	if (typeof field !== "string" || Number.isNaN(fieldNum)) {
		throw new Error(`${fieldName} is required and must be a number`);
	}
	return fieldNum;
}

// GET to return from ALL rankups in table

// NOTE: Rankups should eventually contain basics for a "finished state", i.e. information about the final rows, how many, titles, colors, and if images were placed in them

/**
 * Functions here are called when the user makes a rankup request with a specific rankup ID
 */

// GET to return a specific rankup's info including images

// PATCH to update a part of a specific rankup's non-image info

// DELETE to remove a speicifc rankup and its associated images from D1 and R2

/**
 * Functions here are called when the user makes a request pertaining non-specific images in a existing rankup
 */

// POST to insert a new image associated with an existing rankup

// IDEA: Image entries in rankup_images should eventually contain a lot more metadata such as title, desc, xPos, yPos, width, height, credit

/**
 * Functions here are called when the user makes a request pertaining to a specific image in a existing rankup
 */

// PATCH to update an existing image's metadata (i.e. cropped, resized, etc.)

// DELETE to remove a specific image from a specific rankup and R2 bucket
