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
    color: string;
};

export function Home() {
    const [count, setCount] = useState<number>(0);
    const [data, setData] = useState<Pokemon[]>([]);
    const [pokemons, setPokemons] = useState<PokemonDetails[]>([]);
    const [atualizado, setAtualizado] = useState<boolean>(false);

    async function loadingPokemons() {
        try {
            const { data } = await api.get(`pokemon/?offset=${count}&limit=20`);
            const fetchedData: Pokemon[] = data.results;
            setData((prevState) => [...prevState, ...fetchedData]);

            const pokemonDetailsArray: PokemonDetails[] = [];
    
            for (const pokemon of fetchedData) {
                const response = await api.get(pokemon.url);
                const species = response.data.species.url;
                const responseSpecies = await api.get(species);
                const color = responseSpecies.data.color.name;
    
                const details: PokemonDetails = {
                    name: response.data.name,
                    types: response.data.types,
                    sprite: response.data.sprites.other['official-artwork'].front_default,
                    color: color
                };
    
                pokemonDetailsArray.push(details);
            }
    

            setPokemons((prevState) => [...prevState, ...pokemonDetailsArray]);
            
    
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        const pokemons : string | null = localStorage.getItem("@Pokemon:pokemons");
        const counts : number | null = Number(localStorage.getItem("@Pokemon:count"));
        if (pokemons) {
            setPokemons(JSON.parse(pokemons));
            setCount(counts);
        }else{
            loadingPokemons();
        }
    }, []);



    useEffect(() => {
        if (count > 0 && atualizado === true) {
            console.log("count,atualizado")
            loadingPokemons();
        }
    }, [count,atualizado]);
    


    useEffect(() => {
        if (pokemons.length > 0) {
            localStorage.setItem("@Pokemon:pokemons", JSON.stringify(pokemons));
            localStorage.setItem("@Pokemon:count", JSON.stringify(count));
        }
    }, [pokemons]);


    return (
        <Container>
            <Header />
            <Content>
                {pokemons.map((pokemon: PokemonDetails, index) =>
                  <div>{pokemon.name}</div>
                )}

              <button onClick={() => {
                    setCount((prevState) => prevState + 20);
                    setAtualizado(true);
                }}>Carregar mais Pokémons</button>
            </Content>
            <Footer />
        </Container>
    );
}
 