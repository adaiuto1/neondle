import { defineStyleConfig } from "@chakra-ui/react";

const Button = defineStyleConfig({
	baseStyle: {
		borderRadius: "0.25em",
		fontWeight: 600,
		fontStyle: "heading",
		justifyContent: "center",
	},
	variants: {
		bar: {
			height: "75px",
			bg: "white",
			fontSize: "1.25em",
			textAlign: "start",
			justifyContent: "start",
			_hover: {
				bg: "primary.blue.500",
			},
		},
	},
	defaultProps: {
		size: "lg",
	},
});

export default Button;
