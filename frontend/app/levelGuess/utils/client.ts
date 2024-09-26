import { API_URL } from "@/app/Neondle";
import { decode, JwtPayload } from "jsonwebtoken";
import { levelType } from "@/types";
import axios, { AxiosError, AxiosResponse } from "axios";
interface levelResponseType {
	level?: levelType;
	session_id?: string;
	error?: {
		status: number;
		message: string;
	};
}
export const getTodaysLevel = async (
	silly_mode: boolean
): Promise<levelResponseType> => {
	const game_info: levelResponseType = await axios
		.get(
			`${API_URL}/levels/clue/today${
				!!silly_mode ? "/silly" : ""
			}?date=${new Date().toLocaleDateString("en-US")}`
		)
		.then((response: AxiosResponse) => {
			const { encoded_clue, session_id } = response.data;
			const d: JwtPayload = decode(encoded_clue) as JwtPayload;
			const decoded_level = JSON.parse(d.level);
			return { level: decoded_level[0] as levelType, session_id: session_id };
		})
		.catch((err: AxiosError) => {
			return {
				error: {
					status: err.status || 500,
					message: err.response?.data
						? JSON.stringify(err.response?.data).toString()
						: "Lost connection to server. Try again later.",
				},
			};
		});
	return game_info;
};
export const makeGuess = async (
	level_name: string
): Promise<levelResponseType> => {
	const guess_target: levelResponseType = await axios
		.post(`${API_URL}/levels/guess`, {
			data: {
				level_name: level_name,
			},
		})
		.then((x: AxiosResponse) => {
			return { level: x.data[0] as levelType };
		})
		.catch((err: AxiosError) => {
			return {
				error: {
					status: err.status || 500,
					message: err.response?.data
						? JSON.stringify(err.response?.data).toString()
						: "Lost Connection to Server",
				},
			};
		});
	return guess_target;
};
