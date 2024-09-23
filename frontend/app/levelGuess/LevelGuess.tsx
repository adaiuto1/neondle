"use client";
import {
	Box,
	VStack,
	Heading,
	HStack,
	Spacer,
	Button,
	SimpleGrid,
	GridItem,
	Menu,
	MenuList,
	MenuItem,
	MenuButton,
	Divider,
	Text,
	useToast,
	Fade,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import type { guesserResultType, levelType } from "@/types";
import { getTodaysLevel } from "./utils/client";
import axios from "axios";
import GuessBox from "./components/GuessBox";
import { getResult } from "./utils/guessHandler";
import {
	handlePreviousSession,
	onWin,
	updateCurrentSessionInfo,
} from "./utils/sessionHandler";
import GuessResultsList from "./components/GuessResultsList";
import { ChevronDownIcon } from "@chakra-ui/icons";

import GameModeInfoButton from "./components/GameModeInfoButton";

export default function LevelGuess({
	defaultSillyMode,
}: {
	defaultSillyMode?: boolean;
}) {
	const toast = useToast();
	const [sillyMode, setSillyMode] = useState(defaultSillyMode);
	const [target, setTarget] = useState<levelType | "loading">("loading");
	const [results, setResults] = useState<guesserResultType[]>([]);
	const [awaitingResponse, setAwaitingResponse] = useState(false);
	// const [lives, setLives] = useState(10);
	const game_finished = !!results[0] && results[0].name;
	const addResult = (new_result: guesserResultType) => {
		setResults([new_result, ...results]);
	};

	useEffect(() => {
		if (!!results[0]) {
			updateCurrentSessionInfo(results[0], !!sillyMode);
			if (results[0].name) {
				onWin(results);
			}
		}
	}, [results]);

	const loadData = async () => {
		handlePreviousSession(setResults, !!sillyMode);
		const todays_level = await getTodaysLevel(!!sillyMode);
		if (!!todays_level) {
			setTarget(todays_level);
		} else {
			alert("Error in level response");
		}
	};

	useEffect(() => {
		setResults([]);
		loadData();
	}, [sillyMode]);

	const onGuess = async (input: string) => {
		setAwaitingResponse(true);
		if (!results.some((x) => x.guessed_level.name.toLowerCase() === input)) {
			const guess_target = await axios
				.get(`http://localhost:8000/levels/name/${input}`)
				.then((x) => {
					return x.data[0];
				})
				.catch(() => {
					return null;
				});
			if (target !== "loading") {
				if (!!guess_target) {
					const new_result = getResult(guess_target, target);
					addResult(new_result);
				} else {
					toast({
						title: "Invalid Guess",
						description: "Provided level name not found",
					});
				}
			}
		}
		setAwaitingResponse(false);
	};

	return (
		<>
			<VStack
				width="100%"
				alignContent="center"
			>
				<Box
					width={{ sm: "100%", lg: "90%", "2xl": "75%" }}
					bg="#FFFFFF80"
					borderRadius="1em"
					boxShadow="lg"
					p="1em"
				>
					<Fade in={true}>
						<HStack width="100%">
							<Box>
								<Heading>{`Neondle ${
									!!sillyMode ? "- Hard Mode" : ""
								}`}</Heading>
								<Text>
									{new Date().toLocaleDateString("en-US", {
										weekday: "long",
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</Text>
							</Box>
							<Spacer></Spacer>
							<GameModeInfoButton></GameModeInfoButton>
							<Menu>
								<MenuButton
									as={Button}
									rightIcon={<ChevronDownIcon />}
									isDisabled={
										(results.length > 0 && !game_finished) ||
										target === "loading"
									}
								>
									{sillyMode ? "Hard Mode" : "Normal Mode"}
								</MenuButton>
								<MenuList>
									<MenuItem onClick={() => setSillyMode(false)}>
										Normal Mode
									</MenuItem>
									<MenuItem onClick={() => setSillyMode(true)}>
										Hard Mode
									</MenuItem>
								</MenuList>
							</Menu>
						</HStack>
						<Divider
							mb="1em"
							mt="0.5em"
						></Divider>
						<VStack alignItems="center">
							<SimpleGrid
								width="100%"
								rowGap={4}
								templateColumns={{ sm: "100%", lg: "70% 30%" }}
							>
								<GridItem colSpan={2}>
									<VStack
										alignItems="start"
										width="100%"
									>
										<HStack width="100%">
											<GuessBox
												disabled={game_finished}
												loading={target === "loading" || awaitingResponse}
												onGuess={onGuess}
											></GuessBox>
										</HStack>
									</VStack>
								</GridItem>
							</SimpleGrid>
							<GuessResultsList results={results}></GuessResultsList>
						</VStack>
					</Fade>
				</Box>
			</VStack>
		</>
	);
}
