"use client";
import Neondle from "./Neondle";
import { Box, ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/theme";
export default function Home() {
	return (
		<ChakraProvider theme={theme}>
			<Box
				width="100vw"
				height="100vh"
			>
				<Neondle></Neondle>;
			</Box>
		</ChakraProvider>
	);
}
