import { useEffect, useState } from "react";
import { Card, Container, Content } from "./style";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { getPokedex } from "../../services/api";
import { PokemonSpriteAndName } from "../../interfaces/PokemonsSpritsAndName";
import { useNavigate, useNavigation } from "react-router-dom";

export function Home() {
    const [data, setData] = useState<PokemonSpriteAndName[]>([]);
    const navigation = useNavigate();

    useEffect(() => {
        getPokedex({ name: "kanto" }).then((pokedexData: PokemonSpriteAndName[]) => {
            setData(pokedexData);
        });
    }, []);

    function redirect(name: string) {
        navigation(`/pokemon/${name}`);
    }

    return (
        <Container>
            <Header />
            <Content>
                {data.map((pokemon, index) => (
                    <Card key={index}>
                        <span>#{pokemon.entry_number}</span>
                        <h2>{pokemon.name.toUpperCase()}</h2>
                        <img onClick={() => redirect(pokemon.name)} src={pokemon.img} alt={pokemon.name} />
                    </Card>
                ))}
            </Content>
            <Footer />
        </Container>
    );
}
