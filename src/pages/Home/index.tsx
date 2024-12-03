import { useEffect, useState } from "react";
import { Container, Content, PokemonContainer, Search } from "./style";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { api } from "../../services/api";
import { Card } from "../../components/Card";
import { InputComponent } from "../../components/Input";
import { CustomSelect } from "../../components/DropDown";

type Pokemon = {
    name: string;
    url: string;
};

type PokemonDetails = {
    name: string;
    types: Array<{ type: { name: string } }>;
    sprite: string;
    color: string;
    id: number;
};

export function Home() {
    const [count, setCount] = useState<number>(0);
    const [pokemons, setPokemons] = useState<PokemonDetails[]>([]);
    const [updated, setUpdated] = useState<boolean>(false);
    const [search, setSearch] = useState<string>();

    async function loadingPokemons() {
        try {
            const { data } = await api.get(`pokemon/?offset=${count}&limit=20`);
            const fetchedData: Pokemon[] = data.results;

            const pokemonDetailsArray: PokemonDetails[] = [];

            for (const pokemon of fetchedData) {
                const response = await api.get(pokemon.url);
                const species = response.data.species.url;
                const responseSpecies = await api.get(species);

                const details: PokemonDetails = {
                    name: response.data.name,
                    types: response.data.types,
                    sprite: response.data.sprites.other['official-artwork'].front_default,
                    color: responseSpecies.data.color.name,
                    id: responseSpecies.data.id
                };

                pokemonDetailsArray.push(details);
            }


            setPokemons((prevState) => [...prevState, ...pokemonDetailsArray]);


        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        const pokemons: string | null = localStorage.getItem("@Pokemon:pokemons");
        const counts: number | null = Number(localStorage.getItem("@Pokemon:count"));
        if (pokemons) {
            setPokemons(JSON.parse(pokemons));
            setCount(counts);
        } else {
            loadingPokemons();
        }
    }, []);



    useEffect(() => {
        if (count > 0 && updated === true) {
            loadingPokemons();
        }
    }, [count, updated]);



    useEffect(() => {
        if (pokemons.length > 0) {
            localStorage.setItem("@Pokemon:pokemons", JSON.stringify(pokemons));
            localStorage.setItem("@Pokemon:count", JSON.stringify(count));
        }
    }, [pokemons]);

    // console.log(pokemons.map((pokemon: PokemonDetails, index) =>
    //     pokemon.types[0].type.name));

    console.log(search)
    return (
        <Container>
            <Header />
            <Content>
                <Search>
                    Tipagem:<CustomSelect setSearch={setSearch} />
                    <InputComponent placeholder="Nome do pokemon" />
                </Search>
                {search === "Sem filtro"
                    ? pokemons.map((pokemon: PokemonDetails) => (
                        <Card
                            key={pokemon.id}
                            entry_number={pokemon.id}
                            name={pokemon.name}
                            img={pokemon.sprite}
                            color={pokemon.color}
                            types={pokemon.types}
                        />
                    ))
                    : pokemons
                        .filter((pokemon) => pokemon.types[0].type.name === search)
                        .map((pokemon: PokemonDetails) => (
                            <Card
                                key={pokemon.id}
                                entry_number={pokemon.id}
                                name={pokemon.name}
                                img={pokemon.sprite}
                                color={pokemon.color}
                                types={pokemon.types}
                            />
                        ))
                }
                <div>
                    <button onClick={() => {
                        setCount((prevState) => prevState + 20);
                        setUpdated(true);
                    }}>Carregar mais Pokémons</button>

                </div>
            </Content>
            <Footer />
        </Container>
    );
}
