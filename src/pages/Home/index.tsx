import { useEffect, useState } from "react";
import { Container, Content, PokemonContainer, Search } from "./style";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { api } from "../../services/api";
import { Card } from "../../components/Card";
import { InputComponent } from "../../components/Input";
import { CustomSelect } from "../../components/DropDown";
import { ScrollButtons } from "../../components/ScrollButtons";

type Pokemon = {
    name: string;
    url: string;
};

type PokemonDetails  = {
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
    const [searchType, setSearchType] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [singlePokemon, setSinglePokemon] = useState<PokemonDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    async function loadingPokemons() {
        try {
            setLoading(true);
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
                    sprite: response.data.sprites.other["official-artwork"].front_default,
                    color: responseSpecies.data.color.name,
                    id: responseSpecies.data.id,
                };

                pokemonDetailsArray.push(details);
            }

            setPokemons((prevState) => [...prevState, ...pokemonDetailsArray]);
        } catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    }

    async function loadSinglePokemon(name: string) {
        try {
            setLoading(true);
            const { data } = await api.get(`pokemon/${name.toLowerCase()}`);
            const species = data.species.url;
            const responseSpecies = await api.get(species);

            const details: PokemonDetails = {
                name: data.name,
                types: data.types,
                sprite: data.sprites.other["official-artwork"].front_default,
                color: responseSpecies.data.color.name,
                id: responseSpecies.data.id,
            };

            setSinglePokemon(details);
        } catch (error) {
            console.error("Pokémon não encontrado.");
            setSinglePokemon(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const savedPokemons = localStorage.getItem("@Pokemon:pokemons");
        const savedCount = Number(localStorage.getItem("@Pokemon:count"));
        if (savedPokemons) {
            setPokemons(JSON.parse(savedPokemons));
            setCount(savedCount);
        } else {
            loadingPokemons();
        }
    }, []);

    useEffect(() => {
        if (count > 0 && updated) {
            loadingPokemons();
        }
    }, [count, updated]);

    useEffect(() => {
        if (pokemons.length > 0) {
            localStorage.setItem("@Pokemon:pokemons", JSON.stringify(pokemons));
            localStorage.setItem("@Pokemon:count", JSON.stringify(count));
        }
    }, [pokemons]);

    useEffect(() => {
        if (search.trim() !== "") {
            const filtered = pokemons.filter((pokemon) => pokemon.name.toLowerCase() === search.toLowerCase());
            if (filtered.length > 0) {
                setSinglePokemon(filtered[0]);
            } else {
                loadSinglePokemon(search);
            }
        } else {
            setSinglePokemon(null);
        }
    }, [search]);

    function getFilteredPokemons() {
        return pokemons.filter((pokemon) => {
            const matchesType =
                searchType === "Sem filtro" ||
                pokemon.types[0].type.name === searchType.toLowerCase() ||
                pokemon.types[1]?.type.name === searchType.toLowerCase();
            return matchesType;
        });
    }

    return (
        <Container>
            <Header />
            <Content>
                <Search>
                    Tipagem: <CustomSelect setSearchType={setSearchType} />
                    <InputComponent placeholder="Nome do Pokémon" onChange={(e) => setSearch(e.target.value)} />
                </Search>
                <PokemonContainer>
                    {singlePokemon ? (
                        <Card
                            key={singlePokemon.id}
                            entry_number={singlePokemon.id}
                            name={singlePokemon.name}
                            img={singlePokemon.sprite}
                            color={singlePokemon.color}
                            types={singlePokemon.types}
                        />
                    ) : getFilteredPokemons().length > 0 ? (
                        getFilteredPokemons().map((pokemon) => (
                            <Card
                                key={pokemon.id}
                                entry_number={pokemon.id}
                                name={pokemon.name}
                                img={pokemon.sprite}
                                color={pokemon.color}
                                types={pokemon.types}
                            />
                        ))
                    ) : (
                        <p>Pokémon não encontrado.</p>
                    )}
                </PokemonContainer>
                <div>
                    {loading ? (
                        <div>Carregando...</div>
                    ) :
                        <button
                            onClick={() => {
                                setCount((prevState) => prevState + 20);
                                setUpdated(true);
                            }}
                        >
                            Carregar mais Pokémons
                        </button>
                    }
                </div>

                <ScrollButtons />
            </Content>
            <Footer />
        </Container>
    );
}
