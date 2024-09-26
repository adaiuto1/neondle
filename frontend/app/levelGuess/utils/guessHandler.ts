import { API_URL } from "@/app/Neondle";
import { guesserResultType } from "@/types";
import axios, { AxiosError, AxiosResponse } from "axios";
interface guessResponseType {
	response?: {
		result: guesserResultType;
	};
	error?: {
		title: string;
		message: string;
	};
}
export const getResult = async (
	session_id: string,
	user_id: string,
	level_name: string
): Promise<guessResponseType> => {
	const response: guessResponseType = await axios
		.post(`${API_URL}/levels/guess?session_id=${session_id}`, {
			data: { user_id: user_id, level_name: level_name },
		})
		.then((x: AxiosResponse) => {
			return { response: { result: x.data } } as guessResponseType;
		})
		.catch((err: AxiosError) => {
			const error_title =
				err.status === 406 ? "Invalid Guess" : "Internal Server Error";
			return {
				error: { title: error_title, message: err.response?.data },
			} as unknown as guessResponseType;
		});
	return response;
};
