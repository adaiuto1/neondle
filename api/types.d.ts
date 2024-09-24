export type levelType = {
	name: string;
	id: string;
	id_difficulty: string;
	chapter: number;
	demons: number;
	record_time: number;
	record_date: string;
};
export type guesserResultType = {
	name: boolean;
	chapter: "high" | "equal" | "low";
	demons: "high" | "equal" | "low";
	record_time: "high" | "equal" | "low";
	record_date: "high" | "equal" | "low";
};
