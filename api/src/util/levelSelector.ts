import sjcl from "sjcl";
export const getTodaysLevelIndex = (include_silly: boolean): number => {
	const num_options = include_silly ? 118 : 87;
	const today = new Date().toLocaleDateString("en-US");
	const bit_array = sjcl.hash.sha256.hash(today);
	const level_index = (Math.abs(bit_array[0]) * 17) % num_options;
	return level_index;
};
export function getRandomLevelIndex(include_silly: boolean) {
	const num_options = include_silly ? 118 : 87;
	const level_index = Math.floor(Math.random() * num_options);
	return level_index;
}
