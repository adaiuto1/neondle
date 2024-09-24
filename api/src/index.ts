import express from "express";
import { levelRouter } from "./routers/levelRouter";
import cors from "cors";
import https from "https";
const PORT = 8000;
const PORT_DEV = 8001;
const corsOption = {
	credentials: true,
	origin: ["*"],
};

const app = express();
https.createServer(app).listen(PORT_DEV, () => {
	console.log(`dev server running on ${PORT_DEV}`);
});
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
app.listen(PORT, () => {
	console.log(`API is listening at ${PORT_DEV}`);
});
