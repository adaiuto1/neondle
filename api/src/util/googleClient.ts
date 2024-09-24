import { google } from "googleapis";
import fs from "fs";
import type { levelType } from "../../types";
export class googleClient {
	credentials_file: string;
	scopes: string[];
	sheets: any;
	spreadsheet_id: string;
	fetchAllLevels: () => any;
	fetchSingleLevelByIndex: (index: number) => any;
	constructor() {
		this.credentials_file = "credentials.json";
		this.scopes = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
		this.sheets = google.sheets("v4");
		this.spreadsheet_id = "1Ppl3ybKwT3d8LfukyL6TCczOOdW0c1VMuSZiQbktW5g";
		this.fetchAllLevels = async () => {
			const auth = new google.auth.GoogleAuth({
				keyFile: this.credentials_file,
				scopes: this.scopes,
			});
			try {
				const response = await this.sheets.spreadsheets.values.get({
					spreadsheetId: this.spreadsheet_id,
					range: "Sheet1!A2:G123",
					auth,
				});
				const values = response.data.values;
				return jsonifyLevelData(values);
			} catch (err) {
				console.error("Error fetching data:", err);
				return [];
			}
		};
		this.fetchSingleLevelByIndex = async (index: number) => {
			let level_index = index;
			if (level_index === 32) {
				level_index = 34;
			} else if (level_index === 84) {
				level_index = 64;
			} else if (level_index === 96) {
				level_index = 56;
			}
			const auth = new google.auth.GoogleAuth({
				keyFile: this.credentials_file,
				scopes: this.scopes,
			});
			try {
				const response = await this.sheets.spreadsheets.values.get({
					spreadsheetId: this.spreadsheet_id,
					range: `Sheet1!A${level_index + 2}:G${level_index + 2}`,
					auth,
				});
				const values = response.data.values;
				console.log(values);
				return jsonifyLevelData(values);
			} catch (err) {
				console.error("Error fetching data:", err);
				return [];
			}
		};
	}
}
function parseTimeToFloat(time: string) {
	const [minutes, seconds] = time.split(":");
	const totalSeconds = parseFloat(minutes) * 60 + parseFloat(seconds);
	return totalSeconds;
}
const jsonifyLevelData = (data: string[][]) => {
	const level_array: levelType[] = data.map((row) => ({
		id: row[5],
		name: row[0],
		chapter: parseInt(row[3]),
		demons: parseInt(row[1]),
		record_time: parseTimeToFloat(row[2]),
		record_date: row[4].toString(),
		id_difficulty: row[6],
	}));
	const level_json = JSON.stringify(level_array, null, 2);
	return level_json;
};
