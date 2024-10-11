import { useEffect, useState } from "react";
import { Card, Container, Content } from "./style";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { getPokedex } from "../../services/api";
import { PokemonSpriteAndName } from "../../interfaces/PokemonsSpritsAndName";

export function Home() {
    const [data, setData] = useState<PokemonSpriteAndName[]>([]);

    useEffect(() => {
        getPokedex({ name: "kanto" }).then((pokedexData: PokemonSpriteAndName[]) => {
            setData(pokedexData);
        });
    }, []);

    return (
        <Container>
            <Header />
            <Content>
                {data.map((pokemon, index) => (
                    <Card key={index}>
                        <span>Pokedex #{pokemon.entry_number}</span>
                        <h2>{pokemon.name.toUpperCase()}</h2>
                        <img width="100px" src={pokemon.img} alt={pokemon.name} />
                    </Card>
                ))}
            </Content>
            <Footer />
        </Container>
    );
}
