"use client";
import {
	Box,
	Button,
	HStack,
	Image,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Spacer,
	Text,
	useDisclosure,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { createContext, useEffect, useMemo, useState } from "react";
import MainMenu from "./mainMenu/MainMenu";
import LevelGuess from "./levelGuess/LevelGuess";
import { currentUserType } from "@/types";
import { loadCurrentUserFromStorage, login, logout } from "./utils/userClient";
import LoginPage from "./mainMenu/LoginPage";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import PlayAsGuestButton from "./user/PlayAsGuestButton";
export enum gameType {
	"MAIN_MENU",
	"LEVEL_GUESS",
	"ID_CHALLENGE",
}
// export const API_URL = `http://localhost:8000`;
export const API_URL = `https://neondle.onrender.com`;

type gameContextType = {
	currentGame: gameType;
	setCurrentGame: (newGame: gameType) => void;
};
type userContextType = {
	currentUser: currentUserType;
	setCurrentUser: (currentUser: currentUserType) => void;
};
export const GameContext = createContext<gameContextType>({
	currentGame: gameType.MAIN_MENU,
	setCurrentGame: () => {},
});
export const UserContext = createContext<userContextType>({
	currentUser: {
		username: undefined,
		token: undefined,
	},
	setCurrentUser: () => {},
});
export default function Neondle() {
	const toast = useToast();
	const [currentUser, setCurrentUser] = useState<currentUserType>({
		username: undefined,
		token: undefined,
		loading: true,
	});
	const { onOpen, onClose, isOpen } = useDisclosure();
	const [action, setAction] = useState<"warning" | "login">("warning");
	const [currentGame, setCurrentGame] = useState<gameType>(gameType.MAIN_MENU);
	useEffect(() => {
		if (!currentUser.username && !!loadCurrentUserFromStorage().token) {
			login({
				token: loadCurrentUserFromStorage().token,
				setCurrentUser: (user: currentUserType) => {
					setCurrentUser(user);
					localStorage.setItem("currentUser", JSON.stringify(user));
				},
				onError: ({ error }) => {
					if (error?.status === 406) {
						toast({
							colorScheme: "red",
							title: "Token Expired/Invalid",
							description: `You have been logged out.`,
						});
						logout({ setCurrentUser: setCurrentUser });
					} else {
						toast({
							colorScheme: "red",
							title: "Internal Error",
							description: `${error?.message}.\n You have been logged out.`,
						});
						logout({ setCurrentUser: setCurrentUser });
					}
				},
			});
		}
		setCurrentUser({ ...currentUser, ...{ loading: false } });
	}, []);
	useMemo(() => {
		console.log(currentUser);
		if (!!currentUser.token) {
			localStorage.setItem("currentUser", JSON.stringify(currentUser));
		}
		onClose();
	}, [currentUser]);
	useMemo(() => {
		if (currentGame !== gameType.MAIN_MENU) {
			if (
				!currentUser.token ||
				currentUser.username?.substring(0, 11).toLowerCase() === "unknownneon"
			) {
				onOpen();
			}
		}
	}, [currentGame]);
	useMemo(() => {
		if (!isOpen) {
			if (!currentUser.token) setCurrentGame(gameType.MAIN_MENU);
		}
		if (isOpen) setAction("warning");
	}, [isOpen]);
	return (
		<>
			<UserContext.Provider value={{ currentUser, setCurrentUser }}>
				<GameContext.Provider value={{ currentGame, setCurrentGame }}>
					<Modal
						isOpen={isOpen}
						onClose={onClose}
						closeOnOverlayClick={false}
					>
						<ModalOverlay></ModalOverlay>
						<ModalContent>
							<ModalHeader>
								{(action === "login" && "Login") ||
									(action === "warning" && "Warning")}
							</ModalHeader>
							{action === "login" && (
								<Box
									width="100%"
									pb="1em"
									px=" 1.5em"
								>
									<ModalBody>
										<LoginPage afterLogin={() => onClose()}></LoginPage>
									</ModalBody>
								</Box>
							)}
							{action === "warning" && (
								<>
									<ModalBody>
										<VStack
											alignContent="start"
											width="100%"
										>
											<Box width="100%">
												<Text fontWeight="bold">
													{`You are not logged in!`}{" "}
												</Text>
											</Box>
											<Box>
												<Text>
													{`Log in or register to gain access to match history, leaderboards, streaks, and more!`}
												</Text>
											</Box>
										</VStack>
									</ModalBody>
									<ModalFooter>
										<HStack width="100%">
											<Button
												size="sm"
												leftIcon={
													<ChevronLeftIcon
														boxSize="1.5em"
														mr="-2"
														ml="-2"
													/>
												}
												onClick={() => onClose()}
												colorScheme="red"
											>
												Back
											</Button>
											<PlayAsGuestButton></PlayAsGuestButton>
											<Spacer></Spacer>
											<Button
												size="md"
												colorScheme="blue"
												onClick={() => setAction("login")}
											>
												Log In
											</Button>
										</HStack>
									</ModalFooter>
								</>
							)}
						</ModalContent>
						<ModalFooter></ModalFooter>
					</Modal>
					<Box
						position="absolute"
						width="100vw"
						height="100vh"
						py="5vh"
						px="5vw"
						zIndex={1}
					>
						{currentGame === gameType.MAIN_MENU && <MainMenu></MainMenu>}
						{currentGame === gameType.LEVEL_GUESS && currentUser.username && (
							<LevelGuess></LevelGuess>
						)}
					</Box>
				</GameContext.Provider>
				<Box
					width="100%"
					height="100vh"
					backgroundColor="#00000010"
					position="absolute"
					zIndex={0}
				></Box>
				<Image
					position="absolute"
					height="105%"
					objectFit="cover"
					alt="background image"
					src={"https://i.imgur.com/V6OaMsi.png"}
					zIndex={-1}
				></Image>
				<Box
					width="100%"
					height="300vh"
					backgroundColor="#1D262E"
					position="absolute"
					zIndex={-2}
				></Box>
			</UserContext.Provider>
		</>
	);
}
