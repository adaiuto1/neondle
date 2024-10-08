"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const levelRouter_1 = require("./routers/levelRouter");
const cors_1 = __importDefault(require("cors"));
const userRouter_1 = require("./routers/userRouter");
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 8000;
const corsOption = {
    credentials: true,
    origin: ["http://localhost:3000", "https://neondle.vercel.app"], // Specific origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow specific methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
};
app.use((0, cors_1.default)(corsOption));
// Handle preflight requests for all routes
app.options("*", (0, cors_1.default)(corsOption));
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
app.use("/levels", levelRouter_1.levelRouter);
app.use("/users", userRouter_1.userRouter);
// You don't need to add this separately because CORS middleware is already handling headers
// app.use(function (req, res, next) {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header(
// 		"Access-Control-Allow-Headers",
// 		"Origin, X-Requested-With, Content-Type, Accept"
// 	);
// 	next();
// });
app.listen(PORT, () => {
    console.log(`API is listening at ${PORT}`);
});
