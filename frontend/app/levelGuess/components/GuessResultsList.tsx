import { guesserResultType } from "@/types";
import GuessResultRow from "./GuessResultRow";
import {
	Box,
	Center,
	GridItem,
	HStack,
	SimpleGrid,
	Spacer,
} from "@chakra-ui/react";
import { useContext } from "react";
import { SillyContext } from "../LevelGuess";
export default function GuessResultsList({
	results,
}: {
	results: guesserResultType[];
}) {
	const sillyMode = useContext(SillyContext);
	return (
		<>
			<SimpleGrid
				columns={sillyMode ? 4 : 5}
				rowGap={3}
				width={sillyMode ? "60%" : "80%"}
			>
				<GridItem fontSize={{ base: "xs", md: "md" }}>
					<HStack>
						<Spacer></Spacer>
						<Box>Level</Box>
					</HStack>
				</GridItem>
				{!sillyMode && (
					<GridItem fontSize={{ base: "xs", md: "md" }}>
						<Center>
							<Box>Chapter</Box>
						</Center>
					</GridItem>
				)}
				<GridItem fontSize={{ base: "xs", md: "md" }}>
					<Center>
						<Box>Demons</Box>
					</Center>
				</GridItem>
				<GridItem fontSize={{ base: "xs", md: "md" }}>
					<Center>
						<Box>WR Time</Box>
					</Center>
				</GridItem>
				<GridItem fontSize={{ base: "xs", md: "md" }}>
					<Center>
						<Box>WR Date</Box>
					</Center>
				</GridItem>

				{results.map((result, index) => {
					return (
						<GuessResultRow
							key={index}
							result={result}
						></GuessResultRow>
					);
				})}
			</SimpleGrid>
		</>
	);
}
