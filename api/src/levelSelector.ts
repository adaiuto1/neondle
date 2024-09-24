import sjcl from "sjcl";
import level_id_mapping from "./util/levelIdMapping.json";
import level_id_list from "./util/levelIdList.json";
export const getTodaysLevelIndex = (
	date_locale_string: string,
	include_silly: boolean
): number => {
	const num_options = include_silly ? 118 : 87;
	const bit_array = sjcl.hash.sha256.hash(date_locale_string);
	const level_index = (Math.abs(bit_array[0]) * 17) % num_options;
	return level_index;
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
export const getLevelIdByName = (name: string): string | null => {
	if (Object(level_id_mapping).hasOwnProperty(name)) {
		console.log(Object(level_id_mapping)[name]);
		return Object(level_id_mapping)[name];
	} else {
		return null;
	}
};
