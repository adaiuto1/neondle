import express from "express";
import { googleClient } from "../util/googleClient";
import {
	getRandomLevelIndex,
	getTodaysLevelIndex,
} from "../util/levelSelector";
const levelRouter = express.Router();
const client = new googleClient();
levelRouter.get("/all", async (req, res) => {
	const levels = await client.fetchAllLevels();
	return res.send(levels);
});
levelRouter.get("/clue/today/silly", async (req, res) => {
	const todays_level_index = getTodaysLevelIndex(true);
	const level = await client.fetchSingleLevel(todays_level_index);
	return res.send(level);
});
levelRouter.get("/clue/today", async (req, res) => {
	const todays_level_index = getTodaysLevelIndex(false);
	const level = await client.fetchSingleLevel(todays_level_index);
	return res.send(level);
});
levelRouter.get("/clue/random", async (req, res) => {
	const level_index = getRandomLevelIndex(false);
	const level = await client.fetchSingleLevel(level_index);
	return res.send(level);
});
levelRouter.get("/clue/random/silly", async (req, res) => {
	const level_index = getRandomLevelIndex(true);
	const level = await client.fetchSingleLevel(level_index);
	return res.send(level);
});
levelRouter.get("/id/:id", async (req, res) => {
	const id = req.params.id;
});
levelRouter.get("/index/:index", async (req, res) => {
	const index = req.params.index;
});
export { levelRouter };
