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
			transition: "200ms ease",

			height: "75px",
			bg: "white",
			fontSize: "1.25em",
			textAlign: "start",
			justifyContent: "space-between",
			_hover: {
				bg: "neutral.200",
			},
		},
	},
	defaultProps: {
		size: "lg",
	},
});

export default Button;
