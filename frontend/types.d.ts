export type levelType = {
	name: string;
	id: string;
	id_difficulty: "easy" | "medium" | "hard";
	chapter: number;
	demons: number;
	record_time: number;
	record_date: string;
};
export type guesserResultType = {
	guessed_level: levelType;
	guessed_level_name: string;
	name: boolean;
	chapter: "high" | "equal" | "low";
	demons: "high" | "equal" | "low";
	record_time: "high" | "equal" | "low";
	record_date: "high" | "equal" | "low";
};

type currentUserType = {
	username: string | undefined;
	token: string | undefined;
	loading?: boolean;
};
