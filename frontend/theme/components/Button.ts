import { defineStyleConfig } from "@chakra-ui/react";

const Button = defineStyleConfig({
	baseStyle: {
		borderRadius: "3px",
		fontWeight: 600,
		fontStyle: "normal",
		letterSpacing: "0.00625rem",
		padding: "0.5rem 1rem",
		gap: "0.5rem",
		justifyContent: "center",
	},
	sizes: {
		sm: {
			h: "2.5rem",
			padding: "0.75rem 0.75rem",
			fontSize: "1rem",
			lineHeight: "1.375rem",
		},
		lg: {
			h: "3.625rem",
			fontSize: "1rem",
		},
	},
	variants: {
		primary: {
			bg: "primary.teal.500",
			color: "neutral.0",
			_hover: {
				bg: "neutral.200",
				color: "neutral.900",
			},
			_disabled: {
				bg: "primary.teal.50",
				color: "neutral.800",
				_hover: {
					bg: "primary.teal.50 !important",
				},
			},
		},
		accent: {
			bg: "primary.gold.100",
			color: "neutral.900",
			_hover: {
				bg: "neutral.200",
				color: "neutral.700",
			},
			_disabled: {
				bg: "primary.teal.50",
				color: "neutral.500",
			},
		},
		tertiary: {
			bg: "transparent",
			color: "primary.teal.600",
			borderColor: "primary.teal.600",
			borderWidth: "1px",
			borderStyle: "solid",
			_hover: {
				bg: "primary.teal.50",
				color: "primary.teal.400",
				borderColor: "primary.teal.400",
			},
			_disabled: {
				bg: "transparent",
				color: "primary.teal.100",
				borderColor: "primary.teal.100",
			},
		},
		secondary: {
			bg: "primary.gray.100",
			color: "primary.blackAlpha.700",
			_hover: {
				bg: "primary.gray.500",
			},
			_disabled: {
				bg: "primary.teal.50",
				color: "neutral.800",
				_hover: {
					bg: "primary.teal.50 !important",
				},
			},
		},
	},
	defaultProps: {
		size: "lg",
		variant: "primary",
	},
});

export default Button;
