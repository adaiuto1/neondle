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
exports.makeGuess = exports.findOrCreateClue = void 0;
const __1 = require("../..");
const findOrCreateClue = (level_name, date_string, silly_mode) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clue = yield __1.prisma.clue.upsert({
            where: {
                level_name_date_silly: {
                    level_name: level_name,
                    date: date_string,
                    silly: silly_mode,
                },
            },
            update: {},
            create: {
                level_name: level_name,
                date: date_string,
                silly: silly_mode,
            },
        });
        return clue;
    }
    catch (err) {
        console.log(err);
    }
});
exports.findOrCreateClue = findOrCreateClue;
const makeGuess = (level, session_id) => __awaiter(void 0, void 0, void 0, function* () { });
exports.makeGuess = makeGuess;
