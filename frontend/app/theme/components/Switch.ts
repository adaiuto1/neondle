import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const baseStyle = defineStyle({
  colorScheme:"teal"
});

export const Switch = defineStyleConfig({ baseStyle });
