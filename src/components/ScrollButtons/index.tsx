import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { Button, Circle, Container } from "./style";
import { useTheme } from "../../hooks/ThemeSwitcher";

export function ScrollButtons() {
    const { theme } = useTheme()
    function top() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function bottom() {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }

    return (
        <Container>
            <Circle>
                <Button onClick={top}>
                    <FaArrowUp color={theme ? "black" : "white"} size={20} />
                </Button>
            </Circle>
            <Circle>
                <Button onClick={bottom}>
                    <FaArrowDown color={theme ? "black" : "white"} size={20} />
                </Button>
            </Circle>
        </Container>


    );
}
