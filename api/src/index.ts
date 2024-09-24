import express from "express";
import { levelRouter } from "./routers/levelRouter";
import cors from "cors";
import https from "https";
import fs from "fs";
const PORT = 8000;
const PORT_DEV = 8001;
const corsOption = {
	credentials: true,
	origin: ["*"],
};

const app = express();

app.use(express.json());
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
https
	.createServer(
		{
			key: fs.readFileSync("localhost-key.pem"),
			cert: fs.readFileSync("localhost.pem"),
		},
		app
	)
	.listen(PORT, "0.0.0.0", () => {
		console.log(`HTTPS server running on port ${PORT}`);
	});
