import sjcl from "sjcl";
import level_id_mapping from "./util/levelIdMapping.json";
import level_id_list from "./util/levelIdList.json";
export const getTodaysLevelIndex = (
	date_locale_string: string,
	include_silly: boolean
): number => {
	const num_options = include_silly ? 118 : 86;
	const bit_array = sjcl.hash.sha256.hash(date_locale_string);
	const level_index = (Math.abs(bit_array[0]) * 17) % num_options;
	switch (level_index) {
		case 84:
			return 14;
		case 32:
			return 80;
		case 96:
			return 60;
		default:
			return level_index;
	}
};
export const getRandomLevelIndex = (include_silly: boolean) => {
	const num_options = include_silly ? 118 : 87;
	const level_index = Math.floor(Math.random() * num_options);
	return level_index;
};
export const getLevelIndexById = (level_id: string): number => {
	const level_index = level_id_list.indexOf(level_id);
	return level_index;
};
export const getLevelIndexByName = (level_name: string): number => {
	const level_id = getLevelIdByName(level_name);
	if (level_id) {
		const level_index = getLevelIndexById(level_id);
		return level_index;
	} else {
		return -1;
	}
};
export const getLevelIdByName = (name: string): string | null => {
	if (Object(level_id_mapping).hasOwnProperty(name.toLowerCase().toString())) {
		console.log(Object(level_id_mapping)[name.toLowerCase().toString()]);
		return Object(level_id_mapping)[name];
	} else {
		return null;
	}
};
