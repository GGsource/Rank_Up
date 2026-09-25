-- Migration number: 0003 	 2026-09-24T21:26:12.651Z
CREATE TABLE
	rankups (
		idempotency_key TEXT PRIMARY KEY NOT NULL -- the key generated on the front end
		rankup_id TEXT, -- ID of the RankUp if it has completed processing
		FOREIGN KEY (rankup_id) REFERENCES rankups (rankup_id)
	);