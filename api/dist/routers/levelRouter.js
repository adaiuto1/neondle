"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.levelRouter = void 0;
const express_1 = __importDefault(require("express"));
const googleClient_1 = require("../util/googleClient");
const levelSelector_1 = require("../levelSelector");
const levelRouter = express_1.default.Router();
exports.levelRouter = levelRouter;
const client = new googleClient_1.googleClient();
levelRouter.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const levels = yield client.fetchAllLevels();
    return res.send(levels);
}));
levelRouter.get("/clue/today/silly", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todays_level_index = (0, levelSelector_1.getTodaysLevelIndex)(true);
    const level = yield client.fetchSingleLevelByIndex(todays_level_index);
    return res.send(level);
}));
levelRouter.get("/clue/today", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todays_level_index = (0, levelSelector_1.getTodaysLevelIndex)(false);
    const level = yield client.fetchSingleLevelByIndex(todays_level_index);
    return res.send(level);
}));
levelRouter.get("/clue/random", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const level_index = (0, levelSelector_1.getRandomLevelIndex)(false);
    const level = yield client.fetchSingleLevelByIndex(level_index);
    return res.send(level);
}));
levelRouter.get("/clue/random/silly", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const level_index = (0, levelSelector_1.getRandomLevelIndex)(true);
    const level = yield client.fetchSingleLevelByIndex(level_index);
    return res.send(level);
}));
levelRouter.get("/id/:level_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { level_id } = req.params;
    if (!!level_id) {
        const level_index = (0, levelSelector_1.getLevelIndexById)(level_id);
        if (level_index !== null) {
            const level = yield client.fetchSingleLevelByIndex(level_index);
            return res.send(level);
        }
        else {
            return res.status(404).send(`Invalid level_id: ${level_id}`);
        }
    }
    else {
        return res.send("No id provided");
    }
}));
levelRouter.get("/name/:level_name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { level_name } = req.params;
    if (!!level_name) {
        const level_id = (0, levelSelector_1.getLevelIndexByName)(level_name);
        if (!!level_id) {
            const level_index = (0, levelSelector_1.getLevelIndexById)(level_id);
            if (level_index !== null) {
                const level = yield client.fetchSingleLevelByIndex(level_index);
                return res.send(level);
            }
            else {
                return res.status(404).send(`Invalid level_id: ${level_id}`);
            }
        }
        else {
            return res.status(404).send(`Invalid level_name: ${level_name}`);
        }
    }
    else {
        return res.status(400).send("No level_name provided");
    }
}));
