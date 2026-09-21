export default {
	async fetch(request: Request, env: Env) {
		const url = new URL(request.url);
		if (url.pathname.startsWith("/api/")) {
			if (url.pathname === "/api/rankups" && request.method === "POST") {
				// POST to make a new rankup entry in table
				/**
				 * Functions here are called when the user makes a rankup request without the need of a specific ID
				 */
				// TODO: Move me to a separate function below
				const rankupData = await request.formData();
				const title = rankupData.get("title"); // TODO: Make sure this isn't null
				const desc = rankupData.get("desc"); // TODO: Does this work if null?
				const rankupImages = rankupData.getAll("rankupImages"); // TODO: Make sure this is File objects
				const listPreset = Number(rankupData.get("listPreset"));
				let response: Response;
				// First insert insert images into the R2 bucket
				const key = ":D"; // TODO: Generate a unique UUID for this image as key
				rankupImages.forEach((rankupImage) => env.RANKUP_BUCKET.put(key, rankupImage)); // TODO: Look into how this could throw an error and how to catch it to return failure below
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
