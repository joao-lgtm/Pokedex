import { useEffect, useState } from "react";
import { Container, Content } from "./style";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { api } from "../../services/api";
import { Card } from "../../components/Card";

type Pokemon = {
    name: string;
    url: string;
};

type PokemonDetails = {
    name: string;
    types: Array<{ type: { name: string } }>;
    sprite: string;
};

export function Home() {
    const [count, setCount] = useState<number>(0);
    const [data, setData] = useState<Pokemon[]>([]);
    const [pokemons,setPokemons] = useState<PokemonDetails[]>([]);


    useEffect(() => {
        api.get(`pokemon/?offset=${count}&limit=20`).then((response) => {
            const fetchedData: Pokemon[] = response.data.results;
            setData((prevStat) => [...prevStat , ...fetchedData]);

            fetchedData.forEach(async (pokemon: Pokemon) => {
                const response = await api.get(pokemon.url);
                const details: PokemonDetails = {
                        name: response.data.name, 
                        types: response.data.types,
                        sprite:  response.data.sprites.other['official-artwork'].front_default
                    };
            
                setPokemons(prevState => [...prevState, details]);
            });
        });


        localStorage.setItem("@Pokemon:pokemons",JSON.stringify(pokemons))
        localStorage.setItem("@pokemon:count",JSON.stringify(count))
        
    }, [count]);



    useEffect(() => {
        
    },[])

   
    console.log(pokemons)

    return (
        <Container>
            <Header />
            <Content>
                {pokemons.map((pokemon: PokemonDetails,index) =>
                    <Card
                        entry_number={index + 1}
                        name={pokemon.name}
                        img={pokemon.sprite}
                    />
                )}
                <button onClick={() => setCount((prevState) => prevState + 20)}>Carregar mais Pokémons</button>
            </Content>
            <Footer />
        </Container>
    );
}
