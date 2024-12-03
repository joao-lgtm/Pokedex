import { useLocation, useNavigate } from "react-router-dom";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { Container, Li, List, Logo } from "./style";
import pikachu from "../../assets/fotos-do-pikachu-4000-x-2250-vu40288uf3uxj3rk 1 (1).svg"
export function Header() {
    const navigation = useNavigate();
    const location = useLocation();

    function pageLocation() {
        switch (location.pathname) {
            case "/":
                return "Pokedex";
            case "/game":
                return "Poketrivia"
        }

    }


    return (
        <Container>
            <Logo>
                <img width={50} src={pikachu} alt="" />
                <h1 onClick={() => navigation("/")}>{pageLocation()}</h1>
            </Logo>

            <nav>
                <List>
                    <Li onClick={() => navigation("/")}><span>Home</span></Li>
                    <Li onClick={() => navigation("/game")}><span >Game</span></Li>
                </List>
            </nav>
           
            <ThemeSwitcher />
        </Container>
    )
}