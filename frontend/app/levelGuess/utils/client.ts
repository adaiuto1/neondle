import { API_URL } from "@/app/Neondle";
import { levelType } from "@/types";
import axios, { AxiosError, AxiosResponse } from "axios";
interface levelResponseType {
	level?: levelType;
	error?: {
		status: number;
		message: string;
	};
}
export const getTodaysLevel = async (
	silly_mode: boolean
): Promise<levelResponseType> => {
	const guess_target: levelResponseType = await axios
		.get(
			`${API_URL}/levels/clue/today${
				!!silly_mode ? "/silly" : ""
			}?date=${new Date().toLocaleDateString("en-US")}`
		)
		.then((x: AxiosResponse) => {
			return { level: x.data[0] as levelType };
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
	return guess_target;
};
export const getLevelByName = async (
	level_name: string
): Promise<levelResponseType> => {
	const guess_target: levelResponseType = await axios
		.get(`${API_URL}/levels/name/${level_name.toLowerCase()}`)
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
