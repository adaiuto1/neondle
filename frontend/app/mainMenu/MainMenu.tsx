import { useContext } from "react";
import { GameContext, gameType } from "../Neondle";
import { Box, Button, Center, HStack, VStack } from "@chakra-ui/react";

export default function MainMenu() {
	const { setCurrentGame } = useContext(GameContext);

	return (
		<>
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
								onClick={() => setCurrentGame(gameType.LEVEL_GUESS)}
								variant="bar"
							>
								<HStack>
									<Box>{`Play Neondle`}</Box>
								</HStack>
							</Button>
						</VStack>
					</Box>
				</Center>
			</Box>
		</>
	);
}
