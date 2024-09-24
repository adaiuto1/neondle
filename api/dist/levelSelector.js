"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLevelIdByName = exports.getLevelIndexById = exports.getRandomLevelIndex = exports.getTodaysLevelIndex = void 0;
const sjcl_1 = __importDefault(require("sjcl"));
const levelIdMapping_json_1 = __importDefault(require("./util/levelIdMapping.json"));
const levelIdList_json_1 = __importDefault(require("./util/levelIdList.json"));
const getTodaysLevelIndex = (date_locale_string, include_silly) => {
    const num_options = include_silly ? 118 : 87;
    const bit_array = sjcl_1.default.hash.sha256.hash(date_locale_string);
    const level_index = (Math.abs(bit_array[0]) * 17) % num_options;
    return level_index;
};
exports.getTodaysLevelIndex = getTodaysLevelIndex;
const getRandomLevelIndex = (include_silly) => {
    const num_options = include_silly ? 118 : 87;
    const level_index = Math.floor(Math.random() * num_options);
    return level_index;
};
exports.getRandomLevelIndex = getRandomLevelIndex;
const getLevelIndexById = (level_id) => {
    const level_index = levelIdList_json_1.default.indexOf(level_id);
    return level_index;
};
exports.getLevelIndexById = getLevelIndexById;
const getLevelIdByName = (name) => {
    if (Object(levelIdMapping_json_1.default).hasOwnProperty(name)) {
        console.log(Object(levelIdMapping_json_1.default)[name]);
        return Object(levelIdMapping_json_1.default)[name];
    }
    else {
        return null;
    }
};
exports.getLevelIdByName = getLevelIdByName;
