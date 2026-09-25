-- Migration number: 0004 	 2026-09-25T16:39:00.618Z
-- Deleting and reinserting child-tables related to rankups table in order to add cascading deletion when a rankup is removed
DROP TABLE rankup_images;

CREATE TABLE
	rankup_images (
		storage_key TEXT PRIMARY KEY NOT NULL, -- Unique key to retrieve this image from R2 bucket
		rankup_id TEXT NOT NULL, -- The rankup form that this image belongs to
		position_index INTEGER NOT NULL, -- The ordering position for this image in the starter container
		FOREIGN KEY (rankup_id) REFERENCES rankups (rankup_id) ON DELETE CASCADE
	);

DROP TABLE idempotency_keys;

CREATE TABLE
	idempotency_keys (
		idempotency_key TEXT PRIMARY KEY NOT NULL, -- the key generated on the front end
		rankup_id TEXT, -- ID of the RankUp if it has completed processing
		FOREIGN KEY (rankup_id) REFERENCES rankups (rankup_id) ON DELETE CASCADE
	);