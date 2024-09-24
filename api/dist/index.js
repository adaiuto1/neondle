"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const levelRouter_1 = require("./routers/levelRouter");
const cors_1 = __importDefault(require("cors"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const PORT = 8000;
const PORT_DEV = 8001;
const corsOption = {
    credentials: true,
    origin: ["*"],
};
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOption));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
app.use("/levels", levelRouter_1.levelRouter);
https_1.default
    .createServer({
    key: fs_1.default.readFileSync("localhost-key.pem"),
    cert: fs_1.default.readFileSync("localhost.pem"),
}, app)
    .listen(PORT, () => {
    console.log(`HTTPS server running on port ${PORT}`);
});
