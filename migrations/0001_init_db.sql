-- Migration number: 0001 	 2026-09-19T17:35:23.335Z
-- Initialization of the `rankups` table. Holds all user created rankup forms
CREATE TABLE
	IF NOT EXISTS rankups (
		rankup_id TEXT PRIMARY KEY, -- Unique UUID to eventually become URL
		title TEXT NOT NULL, -- Required title
		description TEXT, -- Optional description
		style_preset INTEGER NOT NULL -- Required style preset
	);

-- Initialization of the `rankup_images` table. Holds location of all images in R2 and what `rankup` entry they belong to.
CREATE TABLE
	IF NOT EXISTS rankup_images (
		storage_key TEXT PRIMARY KEY, -- Unique key to retrieve this image from R2 bucket
		rankup_id TEXT NOT NULL, -- The rankup form that this image belongs to
		position_index INTEGER NOT NULL, -- The ordering position for this image in the starter container
		FOREIGN KEY (rankup_id) REFERENCES rankups (rankup_id)
	);