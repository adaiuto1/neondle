import { guesserResultType, levelType } from "@/types";
// guessed_level: levelType;
// 	name: boolean;
// 	chapter: "high" | "equal" | "low";
// 	demons: "high" | "equal" | "low";
// 	record_time: "high" | "equal" | "low";
// 	record_date: "high" | "equal" | "low";
export const getResult = (
	guessed_level: levelType,
	target_level: levelType
): guesserResultType => {
	console.log(target_level);
	const name_result = guessed_level.name === target_level.name;
	const chapter_result = () => {
		if (guessed_level.chapter > target_level.chapter) {
			return "high";
		}
		if (guessed_level.chapter == target_level.chapter) {
			return "equal";
		}
		if (guessed_level.chapter < target_level.chapter) {
			return "low";
		}
	};
	const demons_result = () => {
		if (guessed_level.demons > target_level.demons) {
			return "high";
		} else if (guessed_level.demons == target_level.demons) {
			return "equal";
		} else {
			return "low";
		}
	};
	const record_time_result = () => {
		if (guessed_level.record_time > target_level.record_time) {
			return "high";
		} else if (guessed_level.record_time == target_level.record_time) {
			return "equal";
		} else {
			return "low";
		}
	};
	const record_date_result = () => {
		const guess_date = new Date(guessed_level.record_date);
		const target_date = new Date(target_level.record_date);

		if (guessed_level.record_date == target_level.record_date) {
			return "equal";
		}
		if (guess_date > target_date) {
			return "high";
		}
		if (guess_date < target_date) {
			return "low";
		}
	};
	const new_result = {
		guessed_level: guessed_level,
		name: name_result,
		chapter: chapter_result(),
		demons: demons_result(),
		record_date: record_date_result(),
		record_time: record_time_result(),
	};
	return new_result as guesserResultType;
};
