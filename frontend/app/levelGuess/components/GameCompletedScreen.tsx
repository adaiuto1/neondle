import {
	Box,
	Button,
	Center,
	GridItem,
	Heading,
	SimpleGrid,
	Spinner,
	Text,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { getEmojiScoreboard, loadTodaysResults } from "../utils/sessionHandler";
import { UserContext } from "@/app/Neondle";

export default function GameCompletedScreen({
	setSillyMode,
	onClose,
}: {
	setSillyMode: (mode: boolean) => void;
	onClose: () => void;
}) {
	const toast = useToast();
	const today = new Date().toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
	const { currentUser } = useContext(UserContext);
	const [normalEmoji, setNormalEmoji] = useState("");
	const [sillyEmoji, setSillyEmoji] = useState("");
	const [loading, setLoading] = useState(true);
	const normal_emoji_lines = normalEmoji.split("\n");
	const silly_emoji_lines =
		sillyEmoji.length > 3 ? sillyEmoji.split("\n") : null;
	const loadResults = async () => {
		setLoading(true);
		if (currentUser.username) {
			const { response, error } = await loadTodaysResults(currentUser.username);
			if (error) alert(error);
			else if (response) {
				setNormalEmoji(getEmojiScoreboard(response.normal_results));
				setSillyEmoji(getEmojiScoreboard(response.silly_results, true));
			}
		}
		setLoading(false);
	};
	useEffect(() => {
		loadResults();
	}, []);
	// useMemo(() => {
	// 	console.log(normalEmoji);
	// }, [sillyEmoji]);
	return (
		<>
			{loading ? (
				<Center my="5em">
					<Spinner></Spinner>
				</Center>
			) : (
				<SimpleGrid
					width="100%"
					columns={{ base: 1, lg: 2 }}
					gap="2"
					p="1em"
				>
					<GridItem colSpan={1}>
						<Box
							width="100%"
							boxShadow="inner"
							borderRadius="1em"
							p="2em"
						>
							<VStack width="100%">
								<Heading
									fontSize="md"
									fontWeight="bold"
								>
									Normal Mode Results
								</Heading>
								{normal_emoji_lines.map((line, index) => {
									return (
										<Text
											key={`normal-${index}`}
											fontSize="2xl"
											my="-1.5"
										>
											{line}
										</Text>
									);
								})}
								<Button
									mt="1em"
									size="md"
									onClick={() => {
										navigator.clipboard.writeText(
											`[Neondle](<https://neondle.vercel.app>)\n${today} - Normal Mode\n${normalEmoji}`
										);
										toast({
											title: "Copied!",
											position: "top",
										});
									}}
								>
									Copy
								</Button>
							</VStack>
						</Box>
					</GridItem>
					<GridItem colSpan={1}>
						<Box
							width="100%"
							boxShadow="inner"
							p="2em"
						>
							<VStack width="100%">
								<Heading
									fontSize="md"
									fontWeight="bold"
								>
									Hard Mode Results
								</Heading>
								{silly_emoji_lines === null ? (
									<>
										<Text>Not Played</Text>
										<Button
											size="md"
											onClick={() => {
												onClose();
												setSillyMode(true);
											}}
										>
											Play Hard Mode
										</Button>
									</>
								) : (
									<>
										{silly_emoji_lines.map((line, index) => {
											return (
												<Text
													key={`normal-${index}`}
													fontSize="2xl"
													my="-1.5"
												>
													{line}
												</Text>
											);
										})}

										<Button
											mt="1em"
											size="md"
											onClick={() => {
												navigator.clipboard.writeText(
													`[Neondle](<https://neondle.vercel.app>)\n${today} - Hard Mode\n${sillyEmoji}`
												);
												toast({
													title: "Copied!",
													position: "top",
												});
											}}
										>
											Copy
										</Button>
									</>
								)}
							</VStack>
						</Box>
					</GridItem>
				</SimpleGrid>
			)}
		</>
	);
}
