"use client";
import { Box, Image } from "@chakra-ui/react";
import { createContext, useEffect, useState } from "react";
import MainMenu from "./mainMenu/MainMenu";
import LevelGuess from "./levelGuess/LevelGuess";
export enum gameType {
	"MAIN_MENU",
	"LEVEL_GUESS",
	"ID_CHALLENGE",
}
// export const API_URL = `http://localhost:8000`;
export const API_URL = `https://54.211.207.169:8000`;

type gameContextType = {
	currentGame: gameType;
	setCurrentGame: (newGame: gameType) => void;
};
export const GameContext = createContext<gameContextType>({
	currentGame: gameType.MAIN_MENU,
	setCurrentGame: () => {},
});
export default function Neondle() {
	const [currentGame, setCurrentGame] = useState<gameType>(gameType.MAIN_MENU);
	useEffect(() => {}, []);
	return (
		<>
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
		</>
	);
}
