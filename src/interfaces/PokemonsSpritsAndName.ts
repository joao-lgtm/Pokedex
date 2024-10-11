export interface PokemonEntry {
    pokemon_species: {
        name: string;
    };
    entry_number: number;
}

export interface PokemonSpriteAndName {
    entry_number: number;
    name: string;
    img: string;
}
