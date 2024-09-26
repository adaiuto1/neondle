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
exports.getSessionById = exports.updateGameSession = exports.findOrCreateSession = void 0;
const __1 = require("../..");
const findOrCreateSession = (user_id, clue_id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield __1.prisma.session.upsert({
        where: {
            clue_id_user_id: {
                clue_id: clue_id,
                user_id: user_id,
            },
        },
        update: {},
        create: {
            clue_id: clue_id,
            user_id: user_id,
        },
        include: {
            results: {
                orderBy: {
                    number: "desc",
                },
            },
        },
    });
    return session;
});
exports.findOrCreateSession = findOrCreateSession;
const updateGameSession = (session_id, result) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const new_result = yield __1.prisma.result.create({
            data: {
                name: result.name,
                session: {
                    connect: {
                        id: session_id,
                    },
                },
                demons: result.demons,
                chapter: result.chapter,
                record_date: result.record_date,
                record_time: result.record_time,
                guessed_level_name: result.guessed_level.name,
                guessed_level: JSON.stringify(result.guessed_level),
            },
        });
        return !!new_result;
    }
    catch (err) {
        return false;
    }
});
exports.updateGameSession = updateGameSession;
const getSessionById = (session_id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield __1.prisma.session.findFirst({
        where: {
            id: session_id,
        },
        include: {
            clue: true,
            results: true,
        },
    });
    return session;
});
exports.getSessionById = getSessionById;
