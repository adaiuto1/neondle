import express from "express";
import { googleClient } from "../util/googleClient";
import {
	getLevelIndexById,
	getLevelIdByName,
	getRandomLevelIndex,
	getTodaysLevelIndex,
} from "../levelSelector";
import { decode, sign } from "jsonwebtoken";
import { jwt_secret } from "../util/prismaClients/userClient";
import { findOrCreateClue } from "../util/prismaClients/gameClient";
import {
	findOrCreateSession,
	getSessionById,
	updateGameSession,
} from "../util/prismaClients/sessionClient";
import { levelType } from "../../types";
import {
	commitResult,
	getResult,
	validateGuessParams,
} from "../util/guessHandler";
const levelRouter = express.Router();
const google_client = new googleClient();
levelRouter.get("/all", async (req, res) => {
	const levels = await google_client.fetchAllLevels();
	return res.send(levels);
});

levelRouter.get("/start", async (req, res) => {
	const { date, user_id, mode } = req.query;
	const sillyMode = mode?.toString() === "silly";
	if (!date) return res.status(400).send("Missing 'time' query param");
	if (!user_id) return res.status(400).send("No user_id provided");

	try {
		const todays_level_index = getTodaysLevelIndex(
			date.toString(),
			!!sillyMode
		);
		const level = await google_client.fetchSingleLevelByIndex(
			todays_level_index
		);
		const clue = await findOrCreateClue(
			JSON.parse(level)[0].name.toLowerCase(),
			date.toString(),
			sillyMode
		);
		if (!clue) return res.status(500).send("Internal Server Error");
		const session = await findOrCreateSession(user_id?.toString(), clue.id);
		return res.send({
			session_id: session.id,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send("Internal server error");
	}
});

levelRouter.post("/guess", async (req, res) => {
	const { user_id, level_name } = req.body.data;
	const { session_id } = req.query;
	if (!level_name || !user_id || !session_id)
		return res.status(400).send(`Missing query params at /levels/guess`);
	const { is_valid, error_code, error_message } = await validateGuessParams({
		user_id: user_id,
		session_id: session_id.toString(),
		level_name: level_name,
	});
	if (!is_valid) return res.status(error_code).send(error_message);
	const result = await getResult(
		level_name,
		session_id.toString(),
		google_client
	);
	if (!result.demons) {
		return res.status(500).send("Error calculating result");
	}
	updateGameSession(session_id.toString(), result);
	//if(result.name){
	// const score = calculateScore(session_id)
	// updateLeaderboards(user_id, score)
	// }
	return res.status(200).send(result);
});
levelRouter.get(`/resume`, async (req, res) => {
	const { session_id, user_id } = req.query;
	if (!session_id || !user_id)
		return res.status(400).send("Missing params at /resume");
	try {
		const session = await getSessionById(session_id.toString());
		if (session?.user_id === user_id.toString()) {
			return res.status(200).send(session?.results);
		} else {
			return res.status(403).send("You cannot view results from this session");
		}
	} catch (err) {
		return res.status(500).send("Internal server error");
	}
});
export { levelRouter };
