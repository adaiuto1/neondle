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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDaysResults = exports.getSessionById = exports.updateGameSession = exports.findOrCreateSession = void 0;
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
            clue: {
                select: {
                    id: true,
                    silly: true,
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
const getDaysResults = (date_string, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const daysResults = yield __1.prisma.result.findMany({
            where: {
                session: {
                    clue: {
                        date: date_string,
                    },
                    user_id: user_id,
                },
            },
            include: {
                session: {
                    select: {
                        clue: true,
                    },
                },
            },
            orderBy: {
                number: "desc",
            },
        });
        let normal_results = daysResults
            .filter((result) => !result.session.clue.silly)
            .map((result) => {
            const { guessed_level, session, session_id, guessed_level_name } = result, rest = __rest(result, ["guessed_level", "session", "session_id", "guessed_level_name"]);
            return rest;
        });
        let silly_results = daysResults
            .filter((result) => result.session.clue.silly)
            .map((result) => {
            const { guessed_level, session, session_id, guessed_level_name } = result, rest = __rest(result, ["guessed_level", "session", "session_id", "guessed_level_name"]);
            return rest;
        });
        return { normal_results: normal_results, silly_results: silly_results };
    }
    catch (err) {
        return { error: "cant get results" };
    }
});
exports.getDaysResults = getDaysResults;
