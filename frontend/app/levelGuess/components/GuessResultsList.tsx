import { guesserResultType } from "@/types";
import { useEffect } from "react";
import GuessResultRow from "./GuessResultRow";
import {
	Box,
	Center,
	GridItem,
	HStack,
	SimpleGrid,
	Spacer,
} from "@chakra-ui/react";

export default function GuessResultsList({
	results,
}: {
	results: guesserResultType[];
}) {
	useEffect(() => {
		console.log(results);
	}, [results]);
	return (
		<>
			<SimpleGrid
				columns={5}
				rowGap={3}
				width="80%"
			>
				<GridItem>
					<HStack>
						<Spacer></Spacer>
						<Box>Level</Box>
					</HStack>
				</GridItem>
				<GridItem>
					<Center>
						<Box>Chapter</Box>
					</Center>
				</GridItem>
				<GridItem>
					<Center>
						<Box>Demons</Box>
					</Center>
				</GridItem>
				<GridItem>
					<Center>
						<Box>WR Time</Box>
					</Center>
				</GridItem>
				<GridItem>
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
