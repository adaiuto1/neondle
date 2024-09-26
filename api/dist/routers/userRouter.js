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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const userClient_1 = require("../util/prismaClients/userClient");
exports.userRouter = express_1.default.Router();
exports.userRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        return res
            .status(400)
            .send("Invalid username/password in createUser request body.");
    }
    const user_response = yield (0, userClient_1.createUser)(username, password);
    if (!(user_response === null || user_response === void 0 ? void 0 : user_response.new_user)) {
        return res.status(500).send("Error creating new user");
    }
    return res.status(200).send(user_response);
}));
exports.userRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, token } = req.body;
    if (!!token) {
        const user = yield (0, userClient_1.getUserFromToken)(token);
        if (!user) {
            return res.status(400).send(`Invalid user token ${token}`);
        }
        const new_token = (0, userClient_1.createUserToken)(user);
        return res.status(200).send({
            username: user === null || user === void 0 ? void 0 : user.id,
            token: new_token,
        });
    }
    else if (!!username && !!password) {
        const user = yield (0, userClient_1.getUserByName)(username);
        if (!user) {
            return res.status(400).send("User does not exist");
        }
        if ((user === null || user === void 0 ? void 0 : user.password) !== password) {
            return res.status(403).send("Incorrect password");
        }
        const new_token = (0, userClient_1.createUserToken)(user);
        return res.status(200).send({
            username: user === null || user === void 0 ? void 0 : user.id,
            token: new_token,
        });
    }
    else {
        return res.status(400).send("No login credentials provided");
    }
}));
