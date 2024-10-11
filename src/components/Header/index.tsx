import { ThemeSwitcher } from "../ThemeSwitcher";
import { Container } from "./style";

export function Header(){
    return (
        <Container>
            <h1>Pokedex</h1>
            <p>A simple and fun way to learn about Pokémon</p>
            <ThemeSwitcher/>
        </Container>
    )
}