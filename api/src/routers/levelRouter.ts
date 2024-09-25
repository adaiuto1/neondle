import express from "express";
import { googleClient } from "../util/googleClient";
import {
	getLevelIndexById,
	getLevelIdByName,
	getRandomLevelIndex,
	getTodaysLevelIndex,
} from "../levelSelector";
import { sign } from "jsonwebtoken";
import { jwt_secret } from "../util/prismaClients/userClient";
const levelRouter = express.Router();
const client = new googleClient();
levelRouter.get("/all", async (req, res) => {
	const levels = await client.fetchAllLevels();
	return res.send(levels);
});
levelRouter.get("/clue/today/silly", async (req, res) => {
	const { date } = req.query;
	if (!!date) {
		const todays_level_index = getTodaysLevelIndex(date.toString(), true);
		const level = await client.fetchSingleLevelByIndex(todays_level_index);
		try {
			const encoded = sign({ level }, jwt_secret, { expiresIn: "1d" });
			return res.send(encoded);
		} catch (err) {
			return res.status(500).send("Internal server error");
		}
	} else {
		return res.status(400).send("Missing 'time' query param");
	}
});
levelRouter.get("/clue/today", async (req, res) => {
	const { date } = req.query;
	if (!!date) {
		const todays_level_index = getTodaysLevelIndex(date.toString(), false);
		const level = await client.fetchSingleLevelByIndex(todays_level_index);
		try {
			const encoded = sign({ level }, jwt_secret, { expiresIn: "1d" });
			return res.send(encoded);
		} catch (err) {
			return res.status(500).send("Internal server error");
		}
	} else {
		return res.status(400).send("Missing 'time' query param");
	}
});
levelRouter.get("/clue/random", async (req, res) => {
	const level_index = getRandomLevelIndex(false);
	const level = await client.fetchSingleLevelByIndex(level_index);
	return res.send(level);
});
levelRouter.get("/clue/random/silly", async (req, res) => {
	const level_index = getRandomLevelIndex(true);
	const level = await client.fetchSingleLevelByIndex(level_index);
	return res.send(level);
});
levelRouter.get("/id/:level_id", async (req, res) => {
	const { level_id } = req.params;
	if (!!level_id) {
		const level_index = getLevelIndexById(level_id);
		if (level_index !== null) {
			const level = await client.fetchSingleLevelByIndex(level_index);
			return res.send(level);
		} else {
			return res.status(404).send(`Invalid level_id: ${level_id}`);
		}
	} else {
		return res.send("No id provided");
	}
});
levelRouter.get("/name/:level_name", async (req, res) => {
	const { level_name } = req.params;
	if (!level_name) return res.status(400).send("No level_name provided");

	const level_id = getLevelIdByName(level_name);
	if (!level_id)
		return res.status(404).send(`Couldn't resolve level_id for ${level_name}`);
	const level_index = getLevelIndexById(level_id);
	const level = await client.fetchSingleLevelByIndex(level_index);
	if (!level) {
		return res
			.status(500)
			.send(`Invalid index resolved for ${level_name}: ${level_index}`);
	}
	return res.status(200).send(level);
});
export { levelRouter };
