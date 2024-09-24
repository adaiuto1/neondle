import { levelType } from "@/types";
import axios from "axios";
export const getTodaysLevel = async (
	silly_mode: boolean
): Promise<levelType> => {
	const response = await axios
		.get(
			`http://54.211.207.169:8000/levels/clue/today${
				!!silly_mode ? "/silly" : ""
			}?date=${new Date().toLocaleDateString()}`
		)
		.then((x) => {
			return x.data[0];
		})
		.catch(() => {
			return null;
		});
	return response;
};
