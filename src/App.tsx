import { ThemeProvider } from "styled-components"
import { Global } from "./style/global"
import { useTheme } from "./hooks/ThemeSwitcher"
import { darkTheme, lightTheme } from "./style/theme";
import { Routes } from "./routes";

export function App() {
  const { theme } = useTheme();

  const selectedTheme = theme ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={selectedTheme}>
      <Global />
      <Routes />
    </ThemeProvider>
  )
}


