import { guesserResultType, levelType } from "../../../types";
import { prisma } from "../..";

export const findOrCreateSession = async (user_id: string, clue_id: string) => {
	const session = await prisma.session.upsert({
		where: {
			clue_id_user_id: {
				clue_id: clue_id,
				user_id: user_id,
			},
		},
		update: {},
		create: {
			clue_id: clue_id,
			user_id: user_id,
		},
		include: {
			results: {
				orderBy: {
					number: "desc",
				},
			},
			clue: {
				select: {
					id: true,
					silly: true,
				},
			},
		},
	});
	return session;
};
export const updateGameSession = async (
	session_id: string,
	result: guesserResultType
): Promise<boolean> => {
	try {
		const new_result = await prisma.result.create({
			data: {
				name: result.name,
				session: {
					connect: {
						id: session_id,
					},
				},
				demons: result.demons,
				chapter: result.chapter,
				record_date: result.record_date,
				record_time: result.record_time,
				guessed_level_name: result.guessed_level.name,
				guessed_level: JSON.stringify(result.guessed_level),
			},
		});
		return !!new_result;
	} catch (err) {
		return false;
	}
};
export const getSessionById = async (session_id: string) => {
	const session = await prisma.session.findFirst({
		where: {
			id: session_id,
		},
		include: {
			clue: true,
			results: true,
		},
	});
	return session;
};
export const getDaysResults = async (
	date_string: string,
	user_id: string
): Promise<{
	normal_results?: object[];
	silly_results?: object[];
	error?: any;
}> => {
	try {
		const daysResults = await prisma.result.findMany({
			where: {
				session: {
					clue: {
						date: date_string,
					},
					user_id: user_id,
				},
			},
			include: {
				session: {
					select: {
						clue: true,
					},
				},
			},
			orderBy: {
				number: "desc",
			},
		});
		let normal_results = daysResults
			.filter((result) => !result.session.clue.silly)
			.map((result) => {
				const {
					guessed_level,
					session,
					session_id,
					guessed_level_name,
					...rest
				} = result;
				return rest;
			});
		let silly_results = daysResults
			.filter((result) => result.session.clue.silly)
			.map((result) => {
				const {
					guessed_level,
					session,
					session_id,
					guessed_level_name,
					...rest
				} = result;
				return rest;
			});

		return { normal_results: normal_results, silly_results: silly_results };
	} catch (err) {
		return { error: "cant get results" };
	}
};
