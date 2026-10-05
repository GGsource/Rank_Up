/**
 * All colors the user can change a row to
 */
export const fullColorPalette = ["red", "orange", "yellow", "green", "blue", "purple", "white", "black", "pink"];

/**
 * Interface for what a preset should contain
 */
interface ListPreset {
	rows: {
		rowName: string;
		rowColor: string;
	}[];
}

/**
 * All available presets for row formations
 */
const RowPresets = {
	Grade: {
		rows: [
			{ rowName: "S", rowColor: "red" },
			{ rowName: "A", rowColor: "orange" },
			{ rowName: "B", rowColor: "yellow" },
			{ rowName: "C", rowColor: "green" },
			{ rowName: "D", rowColor: "blue" },
			{ rowName: "F", rowColor: "purple" },
		],
	},
	Stars: {
		rows: [
			{ rowName: "5", rowColor: "yellow" },
			{ rowName: "3", rowColor: "orange" },
			{ rowName: "1", rowColor: "red" },
		],
	},
} satisfies Record<string, ListPreset>;

/**
 * Preset index retrieved by name i.e. `ListPresets.Grade -> 0`
 */
export const getPresetIndex = Object.fromEntries(Object.keys(RowPresets).map((name, i) => [name, i])) as Record<
	keyof typeof RowPresets,
	number
>;

/**
 * Preset info retrieved by index i.e. `PresetsByIndex[0] -> Grade:{...}`
 */
export const getPresetByIndex: ListPreset[] = Object.values(RowPresets).map((def) => ({
	...def,
}));
