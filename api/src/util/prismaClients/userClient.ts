import { user } from "@prisma/client";
import { prisma } from "../../index";
import { verify, sign, decode, JwtPayload } from "jsonwebtoken";
import { userType } from "../../../types";
export const jwt_secret = "h34v3nc3ntr4l4uth0r1ty";
interface userResponseType {
	response?: {
		new_user: userType;
		token: string;
	};
	error?: {
		status: number;
		message: string;
	};
}
export const registerUser = async (
	username: string,
	password: string
): Promise<userResponseType> => {
	const existing_user = await prisma.user.findFirst({
		where: {
			id: username,
		},
	});
	if (existing_user) {
		return { error: { status: 403, message: "User Already Exists" } };
	}
	const new_user = await prisma.user.create({
		data: {
			id: username,
			password: password,
		},
	});
	if (!new_user) {
	}
	const token = sign({ username: username }, jwt_secret, {
		expiresIn: "7d",
	});
	return { response: { new_user: new_user, token: token } };
};
export const getUserByName = async (
	username: string
): Promise<userType | null> => {
	const new_user = await prisma.user.findFirst({
		where: {
			id: username,
		},
	});
	return new_user;
};
export const getUserFromToken = async (
	token: string
): Promise<userType | null> => {
	const { username, exp } = decode(token) as {
		username: string;
		exp: number;
	};
	if (Date.now() > exp * 1000) {
		return null;
	}
	try {
		const user = await prisma.user.findFirst({
			where: {
				id: username,
			},
		});
		return user;
	} catch (err) {
		return null;
	}
};
export const createUserToken = (user: userType): string => {
	const token = sign({ username: user.id }, jwt_secret, {
		expiresIn: "7d",
	});
	return token;
};
export const updateUser = async ({
	id,
	new_id,
	new_password,
}: {
	id: string;
	new_id?: string;
	new_password?: string;
}): Promise<userType | null> => {
	try {
		const updated_user = await prisma.user.update({
			where: {
				id: id,
			},
			data: {
				...(!!new_id ? { id: new_id } : {}),
				...(!!new_password ? { password: new_password } : {}),
			},
		});
		return updated_user;
	} catch (err) {
		return null;
	}
};
export const deleteUser = async (user_id: string) => {
	try {
		await prisma.user.delete({
			where: {
				id: user_id,
			},
		});
	} catch (err) {
		console.log(err);
	}
};
