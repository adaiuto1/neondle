import express from "express";
import { googleClient } from "../util/googleClient";
import {
	getLevelIndexById,
	getLevelIdByName,
	getRandomLevelIndex,
	getTodaysLevelIndex,
} from "../levelSelector";
import { decode, sign } from "jsonwebtoken";
import {
	jwt_secret,
	purgeStaleAnonymousNeons,
} from "../util/prismaClients/userClient";
import { findOrCreateClue } from "../util/prismaClients/gameClient";
import {
	findOrCreateSession,
	getDaysResults,
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
		purgeStaleAnonymousNeons();

		const session = await findOrCreateSession(user_id?.toString(), clue.id);
		return res.send({
			session: {
				...session,
				...{
					results: session.results.map((result) => {
						return {
							...result,
							guessed_level: JSON.parse(result.guessed_level),
						};
					}),
				},
			},
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
levelRouter.get("/results/postGame", async (req, res) => {
	try {
		const { date, user_id } = req.query;
		if (!date || !user_id) return res.status(400).send("missing params");
		const { normal_results, silly_results, error } = await getDaysResults(
			date.toString(),
			user_id.toString()
		);
		if (error) return res.status(500).send("Internal server error");
		else {
			return res
				.status(200)
				.send({ normal_results: normal_results, silly_results: silly_results });
		}
	} catch (err) {
		return res.send(err);
	}
});
export { levelRouter };
