import { prisma } from "../..";
import { levelType } from "../../../types";

export const findOrCreateClue = async (
	level_name: string,
	date_string: string,
	silly_mode: boolean
) => {
	try {
		const clue = await prisma.clue.upsert({
			where: {
				level_name_date_silly: {
					level_name: level_name,
					date: date_string,
					silly: silly_mode,
				},
			},
			update: {},
			create: {
				level_name: level_name,
				date: date_string,
				silly: silly_mode,
			},
		});
		return clue;
	} catch (err) {
		console.log(err);
	}
};
export const makeGuess = async (level: levelType, session_id: string) => {};
