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
	origin: ["*"],
};

app.use(cors(corsOption));
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});
app.get("/", (req, res) => {
	res.send("Hello, World!");
});
app.use("/levels", levelRouter);
app.use("/users", userRouter);
app.listen(PORT, () => {
	console.log(`API is listening at ${PORT}`);
});
