import { API_URL } from "@/app/Neondle";
import { guesserResultType } from "@/types";
import axios, { AxiosResponse } from "axios";
interface sessionResponseType {
	response?: {
		session: {
			id: string;
			results: guesserResultType[];
		};
	};
	error?: {
		status: string;
		message: string;
	};
}
export const loadSession = async (
	user_id: string,
	sillyMode: boolean
): Promise<sessionResponseType> => {
	const response: sessionResponseType = await axios
		.get(
			`${API_URL}/levels/start?date=${new Date().toLocaleDateString(
				"en-US"
			)}&user_id=${user_id}${sillyMode ? "&mode=silly" : ""}`
		)
		.then((x: AxiosResponse) => {
			return { response: x.data } as sessionResponseType;
		})
		.catch((err: AxiosResponse) => {
			return {
				error: { error_code: err.status, error_message: err.data },
			} as unknown as sessionResponseType;
		});
	return response;
};
export const onWin = (results: guesserResultType[]) => {
	if (!!results) {
	}
};
export const onLose = (results: guesserResultType[]) => {
	if (!!results) {
	}
};
interface dailyResultsResponseType {
	response?: {
		normal_results: [];
		silly_results: [];
	};
	error?: {
		status: number;
		message: string;
	};
}
export const loadTodaysResults = async (
	user_id: string
): Promise<dailyResultsResponseType> => {
	const { response, error }: dailyResultsResponseType = await axios
		.get(
			`${API_URL}/levels/results/postGame?date=${new Date().toLocaleDateString(
				"en-US"
			)}&user_id=${user_id}`
		)
		.then((response: AxiosResponse) => {
			const normal_results = response.data.normal_results;
			const silly_results = response.data.silly_results;
			return {
				response: {
					normal_results: normal_results,
					silly_results: silly_results,
				},
			} as dailyResultsResponseType;
		})
		.catch((err: AxiosResponse) => {
			return {
				error: { error_code: err.status, error_message: err.data },
			} as unknown as dailyResultsResponseType;
		});
	if (response) return { response };
	else return { error };
};
export const getEmojiScoreboard = (
	results: guesserResultType[],
	silly_mode?: boolean
): string => {
	const emojiMap = {
		high: "🟥",
		low: "🟦",
		equal: "🟩",
	};
	let emojiString = "";

	for (const row of results) {
		const chapterEmoji = emojiMap[row.chapter];
		const demonsEmoji = emojiMap[row.demons];
		const recordTimeEmoji = emojiMap[row.record_time];
		const recordDateEmoji = emojiMap[row.record_date];
		emojiString += `${
			silly_mode ? "" : chapterEmoji
		} ${demonsEmoji} ${recordTimeEmoji} ${recordDateEmoji}\n`;
	}
	return emojiString;
};
