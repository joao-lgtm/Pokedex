import axios from "axios";
import { PokemonSpriteAndName, PokemonEntry } from "../interfaces/PokemonsSpritsAndName";

export async function getPokedex({ name }: { name: string }) {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokedex/${name}`);

    let pokemons : PokemonSpriteAndName[] = [];
    

    response.data.pokemon_entries.map((entry: PokemonEntry) =>{
        const pokemon_img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${entry.entry_number}.png`;
        pokemons.push({entry_number: entry.entry_number, name: entry.pokemon_species.name, img: pokemon_img });
    });

    return pokemons;
}

export async function getPokemon({ name }: { name: string }) {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    return response.data;
}
