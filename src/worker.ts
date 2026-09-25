export default {
	async fetch(request: Request, env: Env) {
		const url = new URL(request.url);
		if (url.pathname.startsWith("/api/")) {
			if (url.pathname === "/api/rankups" && request.method === "POST") {
				/* -------------------------------------------------------------------------- */
				/*                POST to store a new rankup entry in database                */
				/* -------------------------------------------------------------------------- */
				/* ---------------- Validate the data's shape is as required ---------------- */
				const rankupData = await request.formData();
				let rankupShape: RankUpShape;
				try {
					rankupShape = {
						idempotencyKey: getFormString(rankupData, "idempotencyKey"),
						title: getFormString(rankupData, "title"),
						desc: getOptionalFormString(rankupData, "desc"),
						listPreset: getFormInt(rankupData, "listPreset"),
						rankupImages: getFormFiles(rankupData, "rankupImage"),
					};
				} catch (error) {
					const message = error instanceof Error ? error.message : "Unknown rankup data shape validation error";
					return new Response(`Shape of rankup data received is invalid: ${message}`, { status: 422 });
				}

				/* ------ Protect against duplicate requests via idempotency key check ------ */
				try {
					await env.RANKUP_DB.prepare("insert into idempotency_keys (idempotency_key) values (?)")
						.bind(rankupShape.idempotencyKey)
						.run();
				} catch (error) {
					const message = error instanceof Error ? error.message : "";
					if (message.includes("UNIQUE constraint failed")) {
						const existingRankup = await env.RANKUP_DB.prepare(
							"select rankup_id from idempotency_keys where idempotency_key = ?",
						)
							.bind(rankupShape.idempotencyKey)
							.first<{ rankup_id: string | null }>();

						if (existingRankup && existingRankup.rankup_id) {
							return Response.json({ rankupId: existingRankup.rankup_id }, { status: 201 }); // hand back existing rankup
						}
						return new Response("Duplicate submission already in progress", { status: 409 }); // captured race doncition
					}
					return new Response(`Failed to process request: ${message || "Unknown error"}`, { status: 503 });
				}

				/* ----------------- First insert images into the R2 bucket ----------------- */
				const r2Keys: string[] = [];
				const insertR2Results = await Promise.allSettled(
					rankupShape.rankupImages.map((img) => {
						const newKey = crypto.randomUUID();
						r2Keys.push(newKey);
						return env.RANKUP_BUCKET.put(newKey, img);
					}),
				);

				const failures = insertR2Results.filter((r) => r.status === "rejected");
				if (failures.length > 0) {
					await revokeR2Images(env, r2Keys); // Remove all to prevent orphans
					await revokeIdempotency(env, rankupShape.idempotencyKey); // Remove hold on this request
					const failureMessage = failures[0].reason instanceof Error ? failures[0].reason.message : "Unknown R2 insertion error";
					return new Response(`Failed to upload ${failures.length} image(s) into R2 bucket: ${failureMessage}`, { status: 503 });
				}

				/* ------------------ Next insert rankup into rankups table ----------------- */
				const rankupId = crypto.randomUUID();

				try {
					const insertRankUpStmnt = env.RANKUP_DB.prepare(
						"insert into rankups (rankup_id, title, description, style_preset) values (?, ?, ?, ?)",
					).bind(rankupId, rankupShape.title, rankupShape.desc, rankupShape.listPreset);
					// TESTME: Ensure null can ACTUALLY be received for description AND gets saved to the db

					// Also save rankup_id to idempotency keys
					const updateIdempotencyStmnt = env.RANKUP_DB.prepare(
						"update idempotency_keys set rankup_id = ? where idempotency_key = ?",
					).bind(rankupId, rankupShape.idempotencyKey);
					await env.RANKUP_DB.batch([insertRankUpStmnt, updateIdempotencyStmnt]);
				} catch (error) {
					await revokeR2Images(env, r2Keys);
					await revokeIdempotency(env, rankupShape.idempotencyKey); // Remove hold on this request
					const message = error instanceof Error ? error.message : "Unknown rankups insertion error";
					return new Response(`Failed to insert rankup into database: ${message}`, { status: 503 });
				}

				// REVISIT: Can this last part just be batched with the above? Should it?
				/* --------- Finally connect images to rankup in rankup_images table -------- */
				try {
					const statements = r2Keys.map((r2Key, idx) =>
						env.RANKUP_DB.prepare("insert into rankup_images (storage_key, rankup_id, position_index) values (?, ?, ?)").bind(
							r2Key,
							rankupId,
							idx,
						),
					);
					await env.RANKUP_DB.batch(statements);
				} catch (error) {
					await revokeR2Images(env, r2Keys);
					await revokeD1Rankup(env, rankupId);
					const message = error instanceof Error ? error.message : "Unknown rankup_images insertion error";
					return new Response(`Failed to insert image rows into D1 rankup_images table: ${message}`, {
						status: 503,
					});
				}

				return Response.json({ rankupId: rankupId }, { status: 201 });
			}
			return new Response("Not Found", { status: 404 }); // requested path not found
		}
		return env.RANKUP_ASSETS.fetch(request); // non-api call, fallback
	},
};

// Shape of the received rankup data
interface RankUpShape {
	idempotencyKey: string;
	title: string;
	desc: string | null;
	listPreset: number;
	rankupImages: File[];
}

function getFormString(formData: FormData, fieldName: string): string {
	const field = formData.get(fieldName);
	if (typeof field !== "string" || field.trim() === "") {
		throw new Error(`${fieldName} is required and must be a string`);
	}
	return field;
}
function getOptionalFormString(formData: FormData, fieldName: string): string | null {
	const field = formData.get(fieldName);
	if (field instanceof File) {
		throw new Error(`${fieldName} should be either a string or null`);
	}
	return field;
}

function getFormInt(formData: FormData, fieldName: string): number {
	const field = formData.get(fieldName);
	const fieldNum = Number(field);
	if (typeof field !== "string" || field.trim() === "" || !Number.isInteger(fieldNum)) {
		throw new Error(`${fieldName} is required and must be an integer`);
	}
	return fieldNum;
}
function getFormFiles(formData: FormData, fieldName: string): File[] {
	const files = formData.getAll(fieldName);
	if (files.length === 0 || !files.every((f): f is File => f instanceof File)) {
		throw new Error(`${fieldName} are required and must be a File object array`);
	}
	return files;
}

/**
 * Revokes any images that were just inserted into R2, as the process was aborted part way through
 *
 * @param env Environment context
 * @param r2Keys r2 keys for the images we were inserting
 */
async function revokeR2Images(env: Env, r2Keys: string[]) {
	await Promise.allSettled(r2Keys.map((key) => env.RANKUP_BUCKET.delete(key)));
}
/**
 * Revokes the rankup row that was just inserted into D1, as the process was aborted before completion.
 * This also deletes rows from other tables associated with this row, which is crucial behavior.
 *
 * @param env Environment context
 * @param rankupId the rankups table ID of the row to remove
 */
async function revokeD1Rankup(env: Env, rankupId: string) {
	await env.RANKUP_DB.prepare("DELETE FROM rankups WHERE rankup_id = ?").bind(rankupId).run();
}

/**
 *
 * @param env Environment context
 * @param idempotencyKey the unique key for this request
 */
async function revokeIdempotency(env: Env, idempotencyKey: string) {
	await env.RANKUP_DB.prepare("DELETE FROM idempotency_keys WHERE idempotency_key = ?").bind(idempotencyKey).run();
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
