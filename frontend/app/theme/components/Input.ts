import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
	createMultiStyleConfigHelpers(inputAnatomy.keys);

const outline = definePartsStyle({
	field: {
		borderWidth: "2px",
		fontSize: "1rem",
		_placeholder: {
			color: "neutral.400",
		},
		_invalid: {
			borderWidth: "1px",
		},
	},
});

export const Input = defineMultiStyleConfig({ variants: { outline } });
