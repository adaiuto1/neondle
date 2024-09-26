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
const gameClient_1 = require("../util/prismaClients/gameClient");
const sessionClient_1 = require("../util/prismaClients/sessionClient");
const guessHandler_1 = require("../util/guessHandler");
const levelRouter = express_1.default.Router();
exports.levelRouter = levelRouter;
const google_client = new googleClient_1.googleClient();
levelRouter.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const levels = yield google_client.fetchAllLevels();
    return res.send(levels);
}));
levelRouter.get("/start", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, user_id, mode } = req.query;
    const sillyMode = (mode === null || mode === void 0 ? void 0 : mode.toString()) === "silly";
    if (!date)
        return res.status(400).send("Missing 'time' query param");
    if (!user_id)
        return res.status(400).send("No user_id provided");
    try {
        const todays_level_index = (0, levelSelector_1.getTodaysLevelIndex)(date.toString(), !!sillyMode);
        const level = yield google_client.fetchSingleLevelByIndex(todays_level_index);
        const clue = yield (0, gameClient_1.findOrCreateClue)(JSON.parse(level)[0].name.toLowerCase(), date.toString(), sillyMode);
        if (!clue)
            return res.status(500).send("Internal Server Error");
        const session = yield (0, sessionClient_1.findOrCreateSession)(user_id === null || user_id === void 0 ? void 0 : user_id.toString(), clue.id);
        return res.send({
            session: Object.assign(Object.assign({}, session), {
                results: session.results.map((result) => {
                    return Object.assign(Object.assign({}, result), { guessed_level: JSON.parse(result.guessed_level) });
                }),
            }),
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
}));
levelRouter.post("/guess", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, level_name } = req.body.data;
    const { session_id } = req.query;
    if (!level_name || !user_id || !session_id)
        return res.status(400).send(`Missing query params at /levels/guess`);
    const { is_valid, error_code, error_message } = yield (0, guessHandler_1.validateGuessParams)({
        user_id: user_id,
        session_id: session_id.toString(),
        level_name: level_name,
    });
    if (!is_valid)
        return res.status(error_code).send(error_message);
    const result = yield (0, guessHandler_1.getResult)(level_name, session_id.toString(), google_client);
    if (!result.demons) {
        return res.status(500).send("Error calculating result");
    }
    (0, sessionClient_1.updateGameSession)(session_id.toString(), result);
    //if(result.name){
    // const score = calculateScore(session_id)
    // updateLeaderboards(user_id, score)
    // }
    return res.status(200).send(result);
}));
