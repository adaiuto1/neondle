import express from "express";
import { googleClient } from "../util/googleClient";
import {
	getLevelIndexById,
	getLevelIndexByName,
	getRandomLevelIndex,
	getTodaysLevelIndex,
} from "../levelSelector";
const levelRouter = express.Router();
const client = new googleClient();
levelRouter.get("/all", async (req, res) => {
	const levels = await client.fetchAllLevels();
	return res.send(levels);
});
levelRouter.get("/clue/today/silly", async (req, res) => {
	const todays_level_index = getTodaysLevelIndex(true);
	const level = await client.fetchSingleLevelByIndex(todays_level_index);
	return res.send(level);
});
levelRouter.get("/clue/today", async (req, res) => {
	const todays_level_index = getTodaysLevelIndex(false);
	const level = await client.fetchSingleLevelByIndex(todays_level_index);
	return res.send(level);
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
	if (!!level_name) {
		const level_id = getLevelIndexByName(level_name);
		if (!!level_id) {
			const level_index = getLevelIndexById(level_id);
			if (level_index !== null) {
				const level = await client.fetchSingleLevelByIndex(level_index);
				return res.send(level);
			} else {
				return res.status(404).send(`Invalid level_id: ${level_id}`);
			}
		} else {
			return res.status(404).send(`Invalid level_name: ${level_name}`);
		}
	} else {
		return res.status(400).send("No level_name provided");
	}
});
export { levelRouter };
