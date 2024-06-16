import { createContext } from "react";
import { SupportedThemes } from "~/types/theme";

export const ThemeContext = createContext<{
  theme: SupportedThemes;
  setTheme: (t: SupportedThemes) => void;
}>({
  theme: SupportedThemes.LIGHT,
  setTheme: () => {},
});
