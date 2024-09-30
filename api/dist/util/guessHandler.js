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
Object.defineProperty(exports, "__esModule", { value: true });
exports.commitResult = exports.getResult = exports.validateGuessParams = exports.silly_mode_levels = void 0;
const __1 = require("..");
const levelSelector_1 = require("../levelSelector");
const sessionClient_1 = require("./prismaClients/sessionClient");
exports.silly_mode_levels = [
    "spree",
    "breakthrough",
    "glide",
    "closer",
    "hike",
    "switch",
    "access",
    "congregation",
    "sequence",
    "marathon",
    "sacrifice",
    "absolution",
    "elevate traversal i",
    "elevate traversal ii",
    "purify traversal",
    "godspeed traversal",
    "stomp traversal",
    "fireball traversal",
    "dominion traversal",
    "book of life traversal",
    "doghouse",
    "choker",
    "chain",
    "hellevator",
    "razor",
    "all seeing eye",
    "resident saw i",
    "resident saw ii",
    "sunset flip powerbomb",
    "balloon mountain",
    "climbing gym",
    "fisherman suplex",
    "stf",
    "arena",
    "attitude adjustment",
    "rocket",
];
const validateGuessParams = (_a) => __awaiter(void 0, [_a], void 0, function* ({ level_name, user_id, session_id, }) {
    try {
        const session = yield (0, sessionClient_1.getSessionById)(session_id);
        const sillyMode = !!(session === null || session === void 0 ? void 0 : session.clue.silly);
        if (!session)
            return {
                is_valid: false,
                error_code: 404,
                error_message: `Invalid session id`,
            };
        if (user_id !== session.user_id)
            return {
                is_valid: false,
                error_code: 403,
                error_message: `Attempt to use foreign session id`,
            };
        if (level_name.toLowerCase() === "absolution" ||
            level_name.toLowerCase() === "the third temple" ||
            level_name.toLowerCase() === "the clocktower") {
            return {
                is_valid: false,
                error_code: 406,
                error_message: `Boss Fights are not part of Neondle`,
            };
        }
        if (!sillyMode) {
            if (exports.silly_mode_levels.some((x) => x === level_name.toLowerCase())) {
                return {
                    is_valid: false,
                    error_code: 406,
                    error_message: `Sidequests & Chapter 11 are not part of Normal Mode`,
                };
            }
        }
        if ((0, levelSelector_1.getLevelIndexByName)(level_name) < 0) {
            return {
                is_valid: false,
                error_code: 406,
                error_message: "Invalid Guess",
            };
        }
        if (session.results.some((result) => {
            return (result.guessed_level_name.toLowerCase() === level_name.toLowerCase());
        })) {
            return {
                is_valid: false,
                error_code: 406,
                error_message: "Duplicate guess",
            };
        }
        return { is_valid: true, error_code: 200, error_message: "" };
    }
    catch (err) {
        return {
            is_valid: false,
            error_code: 500,
            error_message: `Internal Server Error: ${err}`,
        };
    }
});
exports.validateGuessParams = validateGuessParams;
const getResult = (level_name, session_id, google_client) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, sessionClient_1.getSessionById)(session_id);
    const guessed_level_index = (0, levelSelector_1.getLevelIndexByName)(level_name.toLowerCase());
    const target_level_index = (0, levelSelector_1.getLevelIndexByName)((session === null || session === void 0 ? void 0 : session.clue.level_name) || "");
    const guessed_level_response = yield google_client.fetchSingleLevelByIndex(guessed_level_index);
    const guessed_level = JSON.parse(guessed_level_response)[0];
    const target_level_response = yield google_client.fetchSingleLevelByIndex(target_level_index);
    const target_level = JSON.parse(target_level_response)[0];
    const name_result = guessed_level.name === target_level.name;
    const chapter_result = () => {
        if (guessed_level.chapter > target_level.chapter) {
            return "high";
        }
        if (guessed_level.chapter == target_level.chapter) {
            return "equal";
        }
        if (guessed_level.chapter < target_level.chapter) {
            return "low";
        }
    };
    const demons_result = () => {
        if (guessed_level.demons > target_level.demons) {
            return "high";
        }
        else if (guessed_level.demons == target_level.demons) {
            return "equal";
        }
        else {
            return "low";
        }
    };
    const record_time_result = () => {
        if (guessed_level.record_time > target_level.record_time) {
            return "high";
        }
        else if (guessed_level.record_time == target_level.record_time) {
            return "equal";
        }
        else {
            return "low";
        }
    };
    const record_date_result = () => {
        const guess_date = new Date(guessed_level.record_date);
        const target_date = new Date(target_level.record_date);
        if (guessed_level.record_date == target_level.record_date) {
            return "equal";
        }
        if (guess_date > target_date) {
            return "high";
        }
        if (guess_date < target_date) {
            return "low";
        }
    };
    const new_result = {
        guessed_level: guessed_level,
        name: name_result,
        chapter: chapter_result(),
        demons: demons_result(),
        record_date: record_date_result(),
        record_time: record_time_result(),
    };
    return new_result;
});
exports.getResult = getResult;
const commitResult = (session_id, result) => __awaiter(void 0, void 0, void 0, function* () {
    yield __1.prisma.result.upsert({
        where: {
            session_id_guessed_level_name: {
                session_id: session_id,
                guessed_level_name: result.guessed_level.name,
            },
        },
        update: {},
        create: {
            name: result.name,
            session_id: session_id,
            guessed_level_name: result.guessed_level.name,
            demons: result.demons,
            chapter: result.chapter,
            record_date: result.record_date,
            record_time: result.record_time,
            guessed_level: JSON.stringify(result.guessed_level),
        },
    });
});
exports.commitResult = commitResult;
