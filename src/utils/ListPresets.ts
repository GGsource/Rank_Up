/**
 * Available presets for the default starting Row List
 */

export interface ListPresets {
	presetIndex: number;
	rows: {
		rowName: string;
		rowColor: string;
	}[];
}

export const fullColorPalette = ["red", "orange", "yellow", "green", "blue", "purple", "white", "black", "pink"];

export const GradePreset: ListPresets = {
	presetIndex: 0,
	rows: [
		{ rowName: "S", rowColor: "red" },
		{ rowName: "A", rowColor: "orange" },
		{ rowName: "B", rowColor: "yellow" },
		{ rowName: "C", rowColor: "green" },
		{ rowName: "D", rowColor: "blue" },
		{ rowName: "F", rowColor: "purple" },
	],
};
