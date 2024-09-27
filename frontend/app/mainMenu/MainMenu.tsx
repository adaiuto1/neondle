import { useContext, useMemo, useState } from "react";
import { GameContext, gameType, UserContext } from "../Neondle";
import {
	Box,
	Button,
	Center,
	Fade,
	Flex,
	GenericAvatarIcon,
	HStack,
	Link,
	Modal,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Spacer,
	Spinner,
	Text,
	Tooltip,
	useDisclosure,
	VStack,
} from "@chakra-ui/react";
import { CalendarIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import LoginPage from "./LoginPage";
import OptionsPage from "./OptionsPage";

export default function MainMenu() {
	const { currentUser } = useContext(UserContext);
	const { setCurrentGame } = useContext(GameContext);
	const [awaitingGame, setAwaitingGame] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const todays_date = new Date().toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
	useMemo(() => {
		if (currentUser) onClose();
	}, [currentUser]);
	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
			>
				<ModalOverlay></ModalOverlay>
				<ModalContent>
					<ModalHeader>
						{currentUser.username ? "Options" : "Login"}
					</ModalHeader>
					<Box
						width="100%"
						pb="1em"
						px=" 1.5em"
					>
						{!!currentUser.username ? (
							<>
								<OptionsPage onClose={onClose}></OptionsPage>
							</>
						) : (
							<LoginPage></LoginPage>
						)}
					</Box>
				</ModalContent>
			</Modal>
			<Box
				width="100%"
				pt="10vh"
			>
				<Center>
					<Box
						width={{ base: "90%", sm: "80%", md: "50%", lg: "400px" }}
						height="600px"
					>
						<VStack width="100%">
							<Button
								width="100%"
								isDisabled={currentUser.loading}
								onClick={() => {
									setCurrentGame(gameType.LEVEL_GUESS);
									// if (!currentUser.username) {
									// 	setAwaitingGame(true);
									// 	onOpen();
									// } else {
									// }
								}}
								variant="bar"
								leftIcon={
									<Flex
										align="center"
										gap={3}
									>
										<CalendarIcon></CalendarIcon>
										{`Play Neondle`}
									</Flex>
								}
								rightIcon={
									<Box>
										<HStack></HStack>
									</Box>
								}
							></Button>
							<Tooltip
								label="Coming Soon!"
								hasArrow
								size="lg"
							>
								<Button
									variant="bar"
									width="100%"
									isDisabled
									_hover={{ bg: "blue.200", opacity: "50%" }}
									leftIcon={
										<Flex
											align="center"
											gap={3}
										>
											<InfoOutlineIcon></InfoOutlineIcon>
											{`Leaderboards`}
										</Flex>
									}
								></Button>
							</Tooltip>
							<HStack width="100%">
								<Text>{todays_date}</Text>
								<Spacer></Spacer>
								<Tooltip
									isDisabled={
										!currentUser.username?.toString().includes("AnonymousNeon")
									}
									label="This guest account will be deleted after 24 hours."
								>
									<Box
										as={Link}
										transition="400ms ease"
										_hover={{
											bg: "white",
											textDecoration: "none",
										}}
										p="0.25em 0.5em"
										borderRadius="0.25em"
										onClick={onOpen}
									>
										<HStack>
											{currentUser.loading === true ? (
												<Box>
													<Spinner></Spinner>
												</Box>
											) : (
												<>
													<Fade in={true}>
														<Text>
															{currentUser.username
																?.toString()
																.includes("AnonymousNeon")
																? "Anonymous Neon"
																: currentUser.username || `Register / Log In`}
														</Text>
													</Fade>
													<GenericAvatarIcon
														boxSize="1.5em"
														color="black"
													></GenericAvatarIcon>
												</>
											)}
										</HStack>
									</Box>
								</Tooltip>
							</HStack>
						</VStack>
					</Box>
				</Center>
			</Box>
		</>
	);
}
