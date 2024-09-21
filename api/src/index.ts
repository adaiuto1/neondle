import express from "express";
import { levelRouter } from "./routers/levelRouter";

const app = express();
const PORT = 8000;

app.get("/", (req, res) => {
	res.send("Hello, World!");
});
app.use("/levels", levelRouter);
app.listen(PORT, () => {
	console.log(`API is listening at ${PORT}`);
});
