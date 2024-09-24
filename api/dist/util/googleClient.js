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
exports.googleClient = void 0;
const googleapis_1 = require("googleapis");
class googleClient {
    constructor() {
        this.credentials_file = "credentials.json";
        this.scopes = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
        this.sheets = googleapis_1.google.sheets("v4");
        this.spreadsheet_id = "1Ppl3ybKwT3d8LfukyL6TCczOOdW0c1VMuSZiQbktW5g";
        this.fetchAllLevels = () => __awaiter(this, void 0, void 0, function* () {
            const auth = new googleapis_1.google.auth.GoogleAuth({
                keyFile: this.credentials_file,
                scopes: this.scopes,
            });
            try {
                const response = yield this.sheets.spreadsheets.values.get({
                    spreadsheetId: this.spreadsheet_id,
                    range: "Sheet1!A2:G123",
                    auth,
                });
                const values = response.data.values;
                return jsonifyLevelData(values);
            }
            catch (err) {
                console.error("Error fetching data:", err);
                return [];
            }
        });
        this.fetchSingleLevelByIndex = (index) => __awaiter(this, void 0, void 0, function* () {
            let level_index = index;
            if (level_index === 32) {
                level_index = 34;
            }
            else if (level_index === 84) {
                level_index = 64;
            }
            else if (level_index === 96) {
                level_index = 56;
            }
            const auth = new googleapis_1.google.auth.GoogleAuth({
                keyFile: this.credentials_file,
                scopes: this.scopes,
            });
            try {
                const response = yield this.sheets.spreadsheets.values.get({
                    spreadsheetId: this.spreadsheet_id,
                    range: `Sheet1!A${level_index + 2}:G${level_index + 2}`,
                    auth,
                });
                const values = response.data.values;
                console.log(values);
                return jsonifyLevelData(values);
            }
            catch (err) {
                console.error("Error fetching data:", err);
                return [];
            }
        });
    }
}
exports.googleClient = googleClient;
function parseTimeToFloat(time) {
    const [minutes, seconds] = time.split(":");
    const totalSeconds = parseFloat(minutes) * 60 + parseFloat(seconds);
    return totalSeconds;
}
const jsonifyLevelData = (data) => {
    const level_array = data.map((row) => ({
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
