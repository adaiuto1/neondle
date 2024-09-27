import express from "express";
import crypto, { sign } from "crypto";
import util from "util";
import {
	registerUser,
	createUserToken,
	getUserByName,
	getUserFromToken,
	updateUser,
	deleteUser,
} from "../util/prismaClients/userClient";
import { userType } from "../../types";
import { decode, JwtPayload } from "jsonwebtoken";
import { prisma } from "..";
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
userRouter.get("/", async (req, res) => {
	const { user_id, token } = req.query;
	if (token) {
		const credentials = await getUserFromToken(token.toString());
		if (credentials) return res.status(200).send(credentials);
		return res.status(500).send("Internal Server Error");
	} else if (user_id) {
		{
			const credentials = await getUserFromToken(user_id.toString());
			if (credentials) return res.status(200).send(credentials);
			return res.status(500).send("Internal Server Error");
		}
	} else {
		return res.status(400).send("Missing query params at get /users");
	}
});
userRouter.put("/", async (req, res) => {
	const { token } = req.query;
	const { new_id, new_password } = req.body.data;
	if (!token) return res.status(400).send("Missing token at put /users");
	try {
		const user = await getUserFromToken(token.toString());
		if (!user) return res.status(404).send("User not found from token");
		const updated_user = await updateUser({
			id: user.id,
			new_id: new_id,
			new_password: new_password,
		});
		if (updated_user) {
			const new_token = createUserToken(updated_user);
			return res.status(200).send({
				username: updated_user.id,
				password: updated_user.password,
				token: new_token,
			});
		}
	} catch (err) {
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
userRouter.delete("/", async (req, res) => {
	const { token } = req.query;
	if (!token) return res.status(400).send("No token provided");
	try {
		const user = await getUserFromToken(token.toString());
		if (!user)
			return res.status(404).send("No user associated with this token");
		await deleteUser(user?.id);
		return res.status(200).send("Success");
	} catch (err) {
		console.log(err);
		return res.status(500).send("Couldn't delete user");
	}
});
