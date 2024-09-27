"use client";
import { Box, Image, useToast } from "@chakra-ui/react";
import { createContext, useEffect, useMemo, useState } from "react";
import MainMenu from "./mainMenu/MainMenu";
import LevelGuess from "./levelGuess/LevelGuess";
import { currentUserType } from "@/types";
import { loadCurrentUserFromStorage, login } from "./utils/userClient";
export enum gameType {
	"MAIN_MENU",
	"LEVEL_GUESS",
	"ID_CHALLENGE",
}
//export const API_URL = `http://localhost:8000`;
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
	const [currentGame, setCurrentGame] = useState<gameType>(gameType.MAIN_MENU);
	useEffect(() => {
		//set loading
		if (!currentUser.username && !!loadCurrentUserFromStorage().token) {
			login({
				token: loadCurrentUserFromStorage().token,
				setCurrentUser: (user: currentUserType) => {
					setCurrentUser(user);
					localStorage.setItem("currentUser", JSON.stringify(user));
				},
				onError: ({ error }) => {
					toast({
						colorScheme: "red",
						title: "Login Error",
						description: `${error?.message}.\n Please log in again.`,
					});
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
	}, [currentUser]);
	return (
		<>
			<UserContext.Provider value={{ currentUser, setCurrentUser }}>
				<GameContext.Provider value={{ currentGame, setCurrentGame }}>
					<Box
						position="absolute"
						width="100vw"
						height="100vh"
						py="5vh"
						px="5vw"
						zIndex={1}
					>
						{currentGame === gameType.MAIN_MENU && <MainMenu></MainMenu>}
						{currentGame === gameType.LEVEL_GUESS && <LevelGuess></LevelGuess>}
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
