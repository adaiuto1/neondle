import express from "express";
import crypto, { sign } from "crypto";
import util from "util";
import {
	registerUser,
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
			.send("Invalid/missing credentials in registerUser request body.");
	}
	const { response, error } = await registerUser(username, password);
	if (response?.new_user) {
		return res.status(200).send(response);
	}
	if (error) {
		return res.status(error.status).send(error.message);
	} else {
		return res.status(500).send("Internal Server Error");
	}
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
