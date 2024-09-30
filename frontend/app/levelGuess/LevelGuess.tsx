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
	Divider,
	Text,
	useToast,
	Fade,
	Flex,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
} from "@chakra-ui/react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { guesserResultType } from "@/types";
import GuessBox from "./components/GuessBox";
import { loadSession } from "./utils/sessionHandler";
import GuessResultsList from "./components/GuessResultsList";
import GameModeInfoButton from "./components/GameModeInfoButton";
import { GameContext, gameType, UserContext } from "../Neondle";
import { getResult } from "./utils/guessHandler";
import GameCompletedScreen from "./components/GameCompletedScreen";
export const SillyContext = createContext(false);
export default function LevelGuess() {
	const todays_date = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});
	const toast = useToast();
	const { setCurrentGame } = useContext(GameContext);
	const { currentUser } = useContext(UserContext);
	const [sillyMode, setSillyMode] = useState(false);
	const [normalCompleted, setNormalCompleted] = useState(false);
	const [sessionId, setSessionId] = useState<string | undefined>(undefined);
	const [results, setResults] = useState<guesserResultType[]>([]);
	const [awaitingResponse, setAwaitingResponse] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const addResult = (new_result: guesserResultType) => {
		setResults([new_result, ...results]);
	};
	useEffect(() => {
		if (!!currentUser.username) {
			loadData();
		}
	}, [sillyMode, currentUser]);
	useMemo(() => {
		if (!!results[0]) {
			if (results[0].name) {
				// onWin();
				onOpen();
				if (!sillyMode) {
					setNormalCompleted(true);
				}
			}
		}
	}, [results]);

	const loadData = async () => {
		setAwaitingResponse(true);
		const { response, error } = await loadSession(
			currentUser.username || (Math.random() * Date.now()).toString(),
			!!sillyMode
		);
		if (response) {
			setSessionId(response.session.id);
			setResults(response.session.results);
			setAwaitingResponse(false);
		}
		if (error) {
			toast({
				position: "top",
				title: `Connection Error ${error.status}`,
				description: `${error.message}`,
			});
			setAwaitingResponse(false);
		}
	};
	const onGuess = async (input: string) => {
		setAwaitingResponse(true);
		if (sessionId && currentUser.username) {
			const { response, error } = await getResult(
				sessionId,
				currentUser.username,
				input
			);
			if (response) {
				addResult(response.result);
				setAwaitingResponse(false);
			}
			if (error) {
				toast({
					position: "top",
					colorScheme: "orange",
					title: error.title,
					description: error.message,
				});
				setAwaitingResponse(false);
			}
		}
	};
	return (
		<>
			<SillyContext.Provider value={!!sillyMode}>
				<Modal
					isOpen={isOpen}
					onClose={onClose}
					size="3xl"
				>
					<ModalOverlay></ModalOverlay>
					<ModalContent>
						<ModalHeader>Game Complete!</ModalHeader>
						<ModalCloseButton></ModalCloseButton>
						<GameCompletedScreen
							setSillyMode={setSillyMode}
							onClose={() => {
								setResults([]);
								onClose();
							}}
						></GameCompletedScreen>
					</ModalContent>
				</Modal>
				<VStack
					width="100%"
					alignContent="center"
				>
					<Box
						width={{ sm: "100%", "2xl": "80%" }}
						bg="#FFFFFFC0"
						borderRadius="1em"
						boxShadow="lg"
						minHeight="25vh"
						p="1em"
					>
						<Fade in={true}>
							<HStack width="100%">
								<Box>
									<Heading
										_hover={{ cursor: "pointer" }}
										onClick={() => setCurrentGame(gameType.MAIN_MENU)}
									>{`Neondle ${!!sillyMode ? "- Hard Mode" : ""}`}</Heading>
									<Text>{todays_date}</Text>
								</Box>
								<Spacer></Spacer>

								<GameModeInfoButton
									disableToolTip={results.length > 0}
								></GameModeInfoButton>
								{normalCompleted && (
									<Button
										colorScheme={sillyMode ? "green" : "red"}
										onClick={() => {
											setResults([]);
											setSillyMode(!sillyMode);
										}}
									>
										{sillyMode ? `Play Normal Mode` : `Play Hard Mode`}
									</Button>
								)}
							</HStack>
							<Divider
								mb="1em"
								mt="0.5em"
							></Divider>
							<VStack alignItems="center">
								<SimpleGrid
									width="100%"
									rowGap={4}
									templateColumns={{ sm: "100%", lg: "25% 37.5% 37.5%" }}
								>
									<GridItem colSpan={{ base: 1, lg: 3 }}>
										<VStack
											alignItems="start"
											width="100%"
										>
											<HStack width="100%">
												<GuessBox
													disabled={!!results[0] && results[0].name}
													loading={awaitingResponse || !currentUser.username}
													onGuess={onGuess}
												></GuessBox>
											</HStack>
										</VStack>
									</GridItem>
									<GridItem colSpan={1}></GridItem>
									<GridItem colSpan={{ base: 1, lg: 2 }}>
										<Flex width="100%">
											<GuessResultsList results={results}></GuessResultsList>
										</Flex>
									</GridItem>
								</SimpleGrid>
							</VStack>
						</Fade>
					</Box>
				</VStack>
			</SillyContext.Provider>
		</>
	);
}
