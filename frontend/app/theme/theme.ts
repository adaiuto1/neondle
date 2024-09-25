import { extendTheme } from "@chakra-ui/react";
import styles from "./foundations/styles";
import colors from "./foundations/colors";
import borders from "./foundations/borders";
import spacing from "./foundations/spacing";
import shadows from "./foundations/shadows";
import fonts from "./foundations/fonts";
import Button from "./components/Button";
import { Heading } from "./components/Heading";
import { Card } from "./components/Card";
import FormLabel from "./components/FormLabel";
import { Input } from "./components/Input";

const theme = {
  styles: styles,
  colors: colors,
  borders: borders,
  spacing: spacing,
  shadows: shadows,
  fonts: fonts,
  components: {
    Button,
    Heading,
    Card,
    FormLabel,
    Input,
  },
};

export default extendTheme(theme);
