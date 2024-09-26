import { guesserResultType } from "@/types";
import GuessResultBox from "./GuessResultBox";
import { Box, Fade, GridItem, Heading } from "@chakra-ui/react";
import { useContext } from "react";
import { SillyContext } from "../LevelGuess";

export default function GuessResultRow({
	result,
}: {
	result: guesserResultType;
}) {
	const sillyMode = useContext(SillyContext);
	return (
		<>
			<GridItem>
				<Fade in={true}>
					<Box>
						<Heading
							fontSize={{ base: "xs", md: "md", xl: "xl" }}
							fontWeight="bold"
							textAlign="end"
						>
							{result.guessed_level.name}
						</Heading>
					</Box>
				</Fade>
			</GridItem>
			{!sillyMode && (
				<GridItem>
					<Fade in={true}>
						<GuessResultBox
							value={result.guessed_level.chapter}
							accuracy={result.chapter}
						></GuessResultBox>
					</Fade>
				</GridItem>
			)}
			<GridItem>
				<Fade in={true}>
					<GuessResultBox
						value={result.guessed_level.demons}
						accuracy={result.demons}
					></GuessResultBox>
				</Fade>
			</GridItem>
			<GridItem>
				<Fade in={true}>
					<GuessResultBox
						value={result.guessed_level.record_time}
						accuracy={result.record_time}
					></GuessResultBox>
				</Fade>
			</GridItem>
			<GridItem>
				<Fade in={true}>
					<GuessResultBox
						value={result.guessed_level.record_date}
						accuracy={result.record_date}
					></GuessResultBox>
				</Fade>
			</GridItem>
		</>
	);
}
