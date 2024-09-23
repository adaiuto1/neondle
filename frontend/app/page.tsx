import Neondle from "./Neondle";
import { Box, ChakraProvider } from "@chakra-ui/react";

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
