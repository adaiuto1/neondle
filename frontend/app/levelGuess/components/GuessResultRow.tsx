import { guesserResultType } from "@/types";
import GuessResultBox from "./GuessResultBox";
import { Fade, GridItem, Heading } from "@chakra-ui/react";

export default function GuessResultRow({
	result,
}: {
	result: guesserResultType;
}) {
	return (
		<>
			<GridItem>
				<Fade in={true}>
					<Heading
						fontSize="lg"
						textAlign="end"
					>
						{result.guessed_level.name}
					</Heading>
				</Fade>
			</GridItem>
			<GridItem>
				<Fade in={true}>
					<GuessResultBox
						value={result.guessed_level.chapter}
						accuracy={result.chapter}
					></GuessResultBox>
				</Fade>
			</GridItem>
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
