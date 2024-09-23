import { guesserResultType } from "@/types";
export const updateCurrentSessionInfo = (
	new_result: guesserResultType,
	sillyMode: boolean
) => {
	const item_name = `LEVEL_GUESS${sillyMode ? "_SILLY" : ""}`;
	const stored_session = localStorage.getItem(item_name);
	const session = !!stored_session
		? JSON.parse(stored_session)
		: {
				date: new Date().toLocaleDateString(),
				results: [],
		  };
	if (
		!session.results.some(
			(x: guesserResultType) =>
				x.guessed_level.name === new_result.guessed_level.name
		)
	) {
		session.results.push(new_result);
	}
	localStorage.setItem(item_name, JSON.stringify(session));
};
export const onWin = (results: guesserResultType[]) => {
	if (!!results) {
	}
};
export const onLose = (results: guesserResultType[]) => {
	if (!!results) {
	}
};
export const handlePreviousSession = async (
	setResults: (new_result: guesserResultType[]) => void,
	sillyMode: boolean
) => {
	const item_name = `LEVEL_GUESS${sillyMode ? "_SILLY" : ""}`;

	const stored_session = localStorage.getItem(item_name);
	if (!!stored_session) {
		const session_info = JSON.parse(stored_session);
		if (
			new Date(session_info["date"]).toDateString() == new Date().toDateString()
		) {
			const last_sessions_results = session_info.results;
			setResults(last_sessions_results.reverse());
			if (last_sessions_results[0].name) {
				onWin(last_sessions_results);
			}
		} else {
			localStorage.removeItem(item_name);
		}
	}
};
