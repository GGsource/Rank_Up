/**
 * Available presets for the default starting Row List
 */

export interface ListPresets {
	rows: {
		rowName: string;
		rowColor: string;
	}[];
}

export const GradePreset: ListPresets = {
	rows: [
		{ rowName: "Apple", rowColor: "red" },
		{ rowName: "Orange", rowColor: "orange" },
		{ rowName: "Banana", rowColor: "yellow" },
		{ rowName: "Lime", rowColor: "green" },
		{ rowName: "Blueberry", rowColor: "blue" },
		{ rowName: "Grape", rowColor: "purple" },
	],
};
