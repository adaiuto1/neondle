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
exports.createUserToken = exports.getUserFromToken = exports.getUserByName = exports.createUser = exports.jwt_secret = void 0;
const index_1 = require("../../index");
const jsonwebtoken_1 = require("jsonwebtoken");
exports.jwt_secret = "h34v3nc3ntr4l4uth0r1ty";
const createUser = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const new_user = yield index_1.prisma.user.create({
        data: {
            id: username,
            password: password,
        },
    });
    if (!new_user) {
        return null;
    }
    const token = (0, jsonwebtoken_1.sign)({ username: username }, exports.jwt_secret, {
        expiresIn: "7d",
    });
    return { new_user: new_user, token: token };
});
exports.createUser = createUser;
const getUserByName = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const new_user = yield index_1.prisma.user.findFirst({
        where: {
            id: username,
        },
    });
    return new_user;
});
exports.getUserByName = getUserByName;
const getUserFromToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, exp } = (0, jsonwebtoken_1.decode)(token);
    if (Date.now() > exp * 1000) {
        return null;
    }
    const user = yield index_1.prisma.user.findFirst({
        where: {
            id: username,
        },
    });
    return user;
});
exports.getUserFromToken = getUserFromToken;
const createUserToken = (user) => {
    const token = (0, jsonwebtoken_1.sign)({ username: user.id }, exports.jwt_secret, {
        expiresIn: "7d",
    });
    return token;
};
exports.createUserToken = createUserToken;
