import { ThemeProvider } from "styled-components"
import { Global } from "./style/global"
import { useTheme } from "./hooks/ThemeSwitcher"
import { darkTheme, lightTheme } from "./style/theme";
import { Home } from "./pages/Home";

export function App() {
  const { theme } = useTheme();

  const selectedTheme = theme ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={selectedTheme}>
      <Global />
      <Home />
    </ThemeProvider>
  )
}


