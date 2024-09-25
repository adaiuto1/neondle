import { user } from "@prisma/client";
import { prisma } from "../../index";
import { verify, sign, decode, JwtPayload } from "jsonwebtoken";
import { userType } from "../../../types";
export const jwt_secret = "h34v3nc3ntr4l4uth0r1ty";
export const createUser = async (
	username: string,
	password: string
): Promise<{ new_user: userType; token: string } | null> => {
	const new_user = await prisma.user.create({
		data: {
			username: username,
			password: password,
		},
	});
	if (!new_user) {
		return null;
	}
	const token = sign({ username: username }, jwt_secret, {
		expiresIn: "7d",
	});
	return { new_user: new_user, token: token };
};
export const getUserByName = async (
	username: string
): Promise<userType | null> => {
	const new_user = await prisma.user.findFirst({
		where: {
			username: username,
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
	const user = await prisma.user.findFirst({
		where: {
			username: username,
		},
	});
	return user;
};
export const createUserToken = (user: userType): string => {
	const token = sign({ username: user.username }, jwt_secret, {
		expiresIn: "7d",
	});
	return token;
};
