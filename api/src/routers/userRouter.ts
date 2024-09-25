import express from "express";
import crypto, { sign } from "crypto";
import util from "util";
import {
	createUser,
	createUserToken,
	getUserByName,
	getUserFromToken,
} from "../util/prismaClients/userClient";
import { userType } from "../../types";
export const userRouter = express.Router();

userRouter.post("/", async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return res
			.status(400)
			.send("Invalid username/password in createUser request body.");
	}
	const user_response = await createUser(username, password);
	if (!user_response?.new_user) {
		return res.status(500).send("Error creating new user");
	}
	return res.status(200).send(user_response);
});
userRouter.post("/login", async (req, res) => {
	const { username, password, token } = req.body;
	let user;
	if (!!token) {
		user = await getUserFromToken(token);
		if (!user) {
			return res.status(400).send(`Invalid user token ${token}`);
		}
	} else if (!!username && !!password) {
		user = await getUserByName(username);
		if (!user) {
			return res.status(400).send("Invalid username");
		}
	}
	const new_token = createUserToken(user as userType);
	return res.status(200).send({
		username: user?.username,
		token: new_token,
	});
});
