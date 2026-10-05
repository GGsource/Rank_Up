-- Migration number: 0002 	 2026-09-23T00:17:26.500Z
-- SQLite is dogshit and doesn't let you alter table columns after its been created
-- so I have to DELETE them and recreate them to apply primary key being not null, which APPARENTLY is not the default in SQLite
DROP TABLE rankups;

CREATE TABLE
	rankups (
		rankup_id TEXT PRIMARY KEY NOT NULL, -- Unique UUID to eventually become URL
		title TEXT NOT NULL, -- Required title
		description TEXT, -- Optional description
		style_preset INTEGER NOT NULL -- Required style preset
	);

DROP TABLE rankup_images;

CREATE TABLE
	rankup_images (
		storage_key TEXT PRIMARY KEY NOT NULL, -- Unique key to retrieve this image from R2 bucket
		rankup_id TEXT NOT NULL, -- The rankup form that this image belongs to
		position_index INTEGER NOT NULL, -- The ordering position for this image in the starter container
		FOREIGN KEY (rankup_id) REFERENCES rankups (rankup_id)
	);