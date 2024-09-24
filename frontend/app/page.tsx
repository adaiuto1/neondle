import Neondle from "./Neondle";
import { Box, ChakraProvider } from "@chakra-ui/react";
export const API_URL = `http://localhost:8000`;
export default function Home() {
	return (
		<ChakraProvider>
			<Box
				width="100vw"
				height="100vh"
			>
				<Neondle></Neondle>;
			</Box>
		</ChakraProvider>
	);
}
