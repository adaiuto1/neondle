import { currentUserType } from "@/types";
import axios, { AxiosError, AxiosResponse } from "axios";
import { API_URL } from "../Neondle";
interface loginProps {
	username?: string;
	password?: string;
	token?: string;
	setCurrentUser: (user: currentUserType) => void;
	onError?: (err: loginResponseType) => void;
}
interface loginResponseType {
	response?: {
		username: string;
		token: string;
	};
	error?: {
		status: number;
		message: string;
	};
}
export const login = async ({
	username,
	password,
	token,
	setCurrentUser,
	onError,
}: loginProps) => {
	const { response, error }: loginResponseType = await axios
		.post(`${API_URL}/users/login`, {
			username: username,
			password: password,
			token: token,
		})
		.then((response: AxiosResponse) => {
			return {
				response: {
					username: response.data.username,
					token: response.data.token,
				},
			} as loginResponseType;
		})
		.catch((err: AxiosError) => {
			return {
				error: {
					status: err.status,
					message: err.response?.data,
				},
			} as loginResponseType;
		});
	if (response?.token) {
		setCurrentUser(response);
	}
	if (!!error && !!onError) {
		onError({ error });
	}
};
interface registerProps {
	username: string;
	password: string;
	onSuccess?: () => void;
	onError?: (error_message: string) => void;
}
export const register = async ({
	username,
	password,
	onSuccess,
	onError,
}: registerProps) => {
	await axios
		.post(`${API_URL}/users`, { username: username, password: password })
		.then(() => {
			if (onSuccess) onSuccess();
		})
		.catch((err) => {
			if (onError) onError(err.response.data);
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
interface credentialsResponseType {
	response?: {
		username: string;
		password?: string;
		token?: string;
	};
	error?: {
		status: number;
		message: string;
	};
}
export const getUserCredentials = async (
	token: string
): Promise<credentialsResponseType> => {
	const { response, error }: credentialsResponseType = await axios
		.get(`${API_URL}/users?token=${token}`)
		.then((response: AxiosResponse) => {
			return {
				response: {
					username: response.data.id,
					password: response.data.password,
				},
			} as credentialsResponseType;
		})
		.catch((err: AxiosError) => {
			return {
				error: {
					status: err.status,
					message: err.response?.data,
				},
			} as credentialsResponseType;
		});
	if (response) {
		return { response };
	} else {
		return { error };
	}
};

export const changePassword = async (
	token: string,
	new_password: string
): Promise<credentialsResponseType> => {
	const { response, error }: credentialsResponseType = await axios
		.put(`${API_URL}/users?token=${token}`, {
			data: { new_password: new_password },
		})
		.then((response: AxiosResponse) => {
			return {
				response: {
					username: response.data.username,
					password: response.data.password,
					token: response.data.token,
				},
			} as credentialsResponseType;
		})
		.catch((err: AxiosError) => {
			return {
				error: {
					status: err.status,
					message: err.response?.data,
				},
			} as credentialsResponseType;
		});
	if (response) {
		return { response };
	} else {
		return { error };
	}
};

export const logout = ({
	setCurrentUser,
}: {
	setCurrentUser: (user: currentUserType) => void;
}) => {
	console.log("logging out");
	setCurrentUser({ username: undefined, token: undefined });
	localStorage.removeItem("currentUser");
};
interface deleteResponseType {
	response?: {
		success: boolean;
	};
	error?: {
		status: number;
		message: string;
	};
}
export const deleteMyAccount = async (
	token: string
): Promise<deleteResponseType> => {
	const { response, error }: deleteResponseType = await axios
		.delete(`${API_URL}/users?token=${token}`)
		.then(() => {
			return {
				response: {
					success: true,
				},
			} as deleteResponseType;
		})
		.catch((err: AxiosError) => {
			return {
				error: {
					status: err.status,
					message: err.response?.data,
				},
			} as deleteResponseType;
		});
	if (response) {
		return { response };
	} else {
		return { error };
	}
};
