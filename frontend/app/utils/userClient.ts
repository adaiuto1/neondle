import { currentUserType } from "@/types";
import axios, { AxiosError, AxiosResponse } from "axios";
import { API_URL } from "../Neondle";
interface loginProps {
	username?: string;
	password?: string;
	token?: string;
	setCurrentUser: (currentUser: currentUserType) => void;
	onError?: (message?: string) => void;
}

export const login = async ({
	setCurrentUser,
	onError,
	username,
	password,
	token,
}: loginProps): Promise<void> => {
	await axios
		.post(`${API_URL}/users/login`, {
			username: username,
			password: password,
			token: token,
		})
		.then((response: AxiosResponse) => {
			const { username, token } = response.data;
			setCurrentUser({ username, token } as currentUserType);
		})
		.catch((err: AxiosError) => {
			if (!!onError) {
				onError(Object(err.response?.data).toString());
			}
		});
};
export const loadCurrentUserFromStorage = (): currentUserType => {
	const stored_user = localStorage.getItem("currentUser");
	if (!stored_user) {
		return {
			username: undefined,
			token: undefined,
		};
	} else {
		const stored_user_object = JSON.parse(stored_user) as currentUserType;
		return stored_user_object;
	}
};
