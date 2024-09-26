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
	if (!!token) {
		const user = await getUserFromToken(token);
		if (!user) {
			return res.status(400).send(`Invalid user token ${token}`);
		}
		const new_token = createUserToken(user as userType);
		return res.status(200).send({
			username: user?.id,
			token: new_token,
		});
	} else if (!!username && !!password) {
		const user = await getUserByName(username);
		if (!user) {
			return res.status(400).send("User does not exist");
		}
		if (user?.password !== password) {
			return res.status(403).send("Incorrect password");
		}
		const new_token = createUserToken(user as userType);
		return res.status(200).send({
			username: user?.id,
			token: new_token,
		});
	} else {
		return res.status(400).send("No login credentials provided");
	}
});
