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
exports.purgeStaleAnonymousNeons = exports.deleteUser = exports.updateUser = exports.createUserToken = exports.getUserFromToken = exports.getUserByName = exports.registerUser = exports.jwt_secret = void 0;
const index_1 = require("../../index");
const jsonwebtoken_1 = require("jsonwebtoken");
exports.jwt_secret = "h34v3nc3ntr4l4uth0r1ty";
const registerUser = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const existing_user = yield index_1.prisma.user.findFirst({
        where: {
            id: username,
        },
    });
    if (existing_user) {
        return { error: { status: 403, message: "User Already Exists" } };
    }
    const new_user = yield index_1.prisma.user.create({
        data: {
            id: username,
            password: password,
        },
    });
    if (!new_user) {
        return { error: { status: 500, message: "Can't register user" } };
    }
    const token = (0, jsonwebtoken_1.sign)({ username: username }, exports.jwt_secret, {
        expiresIn: "7d",
    });
    return { response: { new_user: new_user, token: token } };
});
exports.registerUser = registerUser;
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
    try {
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
    }
    catch (err) {
        return null;
    }
});
exports.getUserFromToken = getUserFromToken;
const createUserToken = (user) => {
    const token = (0, jsonwebtoken_1.sign)({ username: user.id }, exports.jwt_secret, {
        expiresIn: "7d",
    });
    return token;
};
exports.createUserToken = createUserToken;
const updateUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, new_id, new_password, }) {
    try {
        const updated_user = yield index_1.prisma.user.update({
            where: {
                id: id,
            },
            data: Object.assign(Object.assign({}, (!!new_id ? { id: new_id } : {})), (!!new_password ? { password: new_password } : {})),
        });
        return updated_user;
    }
    catch (err) {
        return null;
    }
});
exports.updateUser = updateUser;
const deleteUser = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield index_1.prisma.user.delete({
            where: {
                id: user_id,
            },
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.deleteUser = deleteUser;
const purgeStaleAnonymousNeons = () => __awaiter(void 0, void 0, void 0, function* () {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - 24);
    try {
        yield index_1.prisma.user.deleteMany({
            where: {
                id: {
                    startsWith: "AnonymousNeon",
                },
                date_created: {
                    lt: cutoffDate,
                },
            },
        });
    }
    catch (err) {
        console.log(err);
        console.log("couldnt purge users");
    }
});
exports.purgeStaleAnonymousNeons = purgeStaleAnonymousNeons;
