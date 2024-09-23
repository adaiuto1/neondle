import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Box, Center, HStack, Heading, VStack } from "@chakra-ui/react";
interface GuessResultBoxProps {
	value: string | number;
	accuracy: "high" | "equal" | "low";
}
export default function GuessResultBox({
	value,
	accuracy,
}: GuessResultBoxProps) {
	function getColor() {
		switch (accuracy) {
			case "high":
				return "#ff6b63";
			case "low":
				return "#61b1ed";
			case "equal":
				return "#2cf55e";
		}
	}
	function getIcon(): React.ReactNode {
		switch (accuracy) {
			case "equal":
				return <></>;
			case "high":
				return (
					<ChevronDownIcon
						boxSize={{ base: "1em", md: "2em" }}
						ml="-1"
					></ChevronDownIcon>
				);
			case "low":
				return (
					<ChevronUpIcon
						boxSize={{ base: "1em", md: "2em" }}
						ml="-1"
					></ChevronUpIcon>
				);
		}
	}
	return (
		<>
			<Center>
				<Box
					height={{ base: "50px", lg: "75px" }}
					width="90%"
					borderRadius="0.75em"
					bg={getColor()}
				>
					<HStack height="100%">
						<VStack width="100% ">
							<HStack>
								<Heading
									fontSize={{ base: "0.5em", sm: "0.75em", lg: "1em" }}
									textAlign="end"
								>
									{value}
								</Heading>
								{getIcon()}
							</HStack>
						</VStack>
					</HStack>
				</Box>
			</Center>
		</>
	);
}
