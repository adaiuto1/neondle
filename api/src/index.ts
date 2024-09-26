import express from "express";
import { levelRouter } from "./routers/levelRouter";
import cors from "cors";
import { userRouter } from "./routers/userRouter";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

const app = express();
app.use(express.json());
const PORT = 8000;

const corsOption = {
	credentials: true,
	origin: ["http://localhost:3000", "neondle.vercel.app"], // Specific origin
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow specific methods
	allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
};

app.use(cors(corsOption));

// Handle preflight requests for all routes
app.options("*", cors(corsOption));

app.get("/", (req, res) => {
	res.send("Hello, World!");
});

app.use("/levels", levelRouter);
app.use("/users", userRouter);

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
