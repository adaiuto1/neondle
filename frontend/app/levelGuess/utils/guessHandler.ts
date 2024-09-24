import { guesserResultType, levelType } from "@/types";
export const silly_mode_levels = [
	"spree",
	"breakthrough",
	"glide",
	"closer",
	"hike",
	"switch",
	"access",
	"congregation",
	"sequence",
	"marathon",
	"sacrifice",
	"absolution",
	"elevate traversal i",
	"elevate traversal ii",
	"purify traversal",
	"godspeed traversal",
	"stomp traversal",
	"fireball traversal",
	"dominion traversal",
	"book of life traversal",
	"doghouse",
	"choker",
	"chain",
	"hellevator",
	"razor",
	"all seeing eye",
	"resident saw i",
	"resident saw ii",
	"sunset flip powerbomb",
	"balloon mountain",
	"climbing gym",
	"fisherman suplex",
	"stf",
	"arena",
	"attitude adjustment",
	"rocket",
];

export const validateGuess = (
	input: string,
	results: guesserResultType[],
	sillyMode: boolean
): { is_valid: boolean; message: string } => {
	if (!sillyMode) {
		if (silly_mode_levels.some((x) => x === input.toLowerCase())) {
			return {
				is_valid: false,
				message: `Boss Fights & Ch 11 are not part of Normal Mode`,
			};
		}
	}
	if (
		results.some(
			(x) => x.guessed_level.name.toLowerCase() === input.toLowerCase()
		)
	) {
		return {
			is_valid: false,
			message: `You have already guessed ${
				input.charAt(0).toUpperCase() + input.slice(1)
			}`,
		};
	}
	if (
		input.toLowerCase() === "absolution" ||
		input.toLowerCase() === "the third temple" ||
		input.toLowerCase() === "the clocktower"
	) {
		return {
			is_valid: false,
			message: `Boss Fights are not part of Neondle`,
		};
	} else {
		return { is_valid: true, message: "" };
	}
};
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
