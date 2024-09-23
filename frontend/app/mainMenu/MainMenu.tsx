import { useContext } from "react";
import { GameContext, gameType } from "../Neondle";
import { Box, Button, VStack } from "@chakra-ui/react";

export default function MainMenu() {
	const { setCurrentGame } = useContext(GameContext);

	return (
		<>
			<Box width="100%">
				<VStack width="100%">
					<Button
						width="500px"
						onClick={() => setCurrentGame(gameType.LEVEL_GUESS)}
						size="lg"
					>
						Play Neondle
					</Button>
				</VStack>
			</Box>
		</>
	);
}
