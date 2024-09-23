import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const baseStyle = defineStyle({
  fontStyle: "normal",
  fontWeight: "normal",
  lineHeight: "2.5rem",
  letterSpacing: "0",
});

export const Heading = defineStyleConfig({ baseStyle });
