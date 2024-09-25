import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const outline = definePartsStyle({
  field: {
    border: "1px solid",
    borderColor: "primary.teal.400",
    bg: "neutral.0",
    borderRadius: "3px",
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    _placeholder: {
      color: "neutral.400",
    },
    _hover: {
      borderColor: "neutral.400",
    },
    _focus: {
      borderColor: "primary.teal.500",
      boxShadow: "none",
    },
  },
});

export const Input = defineMultiStyleConfig({ variants: { outline } });
