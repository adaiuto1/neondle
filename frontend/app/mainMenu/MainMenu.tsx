import { useContext } from "react";
import { GameContext, gameType } from "../Neondle";
import { Box, Button, Center, VStack } from "@chakra-ui/react";

export default function MainMenu() {
	const { setCurrentGame } = useContext(GameContext);

	return (
		<>
			<Box width="100%">
				<Center>
					<Box width="500px">
						<Button
							width="500px"
							onClick={() => setCurrentGame(gameType.LEVEL_GUESS)}
							size="lg"
						>
							Play Neondle
						</Button>
					</Box>
				</Center>
			</Box>
		</>
	);
}
