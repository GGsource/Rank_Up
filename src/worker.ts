export default {
	async fetch(request: Request, env: Env) {
		const url = new URL(request.url);
		if (url.pathname.startsWith("/api/")) {
			// your D1/R2 logic goes here, routed by hand — e.g. check
			// url.pathname and request.method yourself, no onRequestX convention
			/**
			 * Functions here are called when the user makes a rankup request without the need of a specific ID
			 */

			// POST to make a new rankup entry in table
			// export const onRequestPost: PagesFunction<Env> = async (context) => {
			console.log(request);
			const rankupData = await request.formData();
			console.log(rankupData);
			let response: Response;
			// First insert insert images into the R2 bucket
			if (true) {
				// env.BUCKET.
				// If image insertion was successful, we can now create a new entry in the rankup table
				// env.DB.prepare()
				// env.DB.exec()
				// If our rankup was sucessfully created, now save the image information to the rankup_images table
				// env.DB.prepare()
				// env.DB.exec()
				const newRankUpId = ""; // TODO: Actually get it back from db
				return Response.json({ rankupId: newRankUpId }, { status: 201 });
			}
			return new Response("Failed to insert: Error here", { status: -999 });
		}
		return env.RANKUP_ASSETS.fetch(request); // fall through to your SPA
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
