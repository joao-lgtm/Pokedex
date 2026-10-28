export const TYPES = [
    "normal", "fire", "water", "grass", "electric", "ice", "fighting", "poison", "ground",
    "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy",
] as const;

export type PokemonType = (typeof TYPES)[number];

export const TYPE_COLORS: Record<PokemonType, string> = {
    normal: "#a8a77a",
    fire: "#ee8130",
    water: "#6390f0",
    grass: "#7ac74c",
    electric: "#f7d02c",
    ice: "#96d9d6",
    fighting: "#c22e28",
    poison: "#a33ea1",
    ground: "#e2bf65",
    flying: "#a98ff3",
    psychic: "#f95587",
    bug: "#a6b91a",
    rock: "#b6a136",
    ghost: "#735797",
    dragon: "#6f35fc",
    dark: "#705746",
    steel: "#b7b7ce",
    fairy: "#d685ad",
};

export const TYPE_LABELS: Record<PokemonType, string> = {
    normal: "Normal",
    fire: "Fogo",
    water: "Água",
    grass: "Planta",
    electric: "Elétrico",
    ice: "Gelo",
    fighting: "Lutador",
    poison: "Veneno",
    ground: "Terra",
    flying: "Voador",
    psychic: "Psíquico",
    bug: "Inseto",
    rock: "Pedra",
    ghost: "Fantasma",
    dragon: "Dragão",
    dark: "Sombrio",
    steel: "Aço",
    fairy: "Fada",
};

export function typeColor(type: string) {
    return TYPE_COLORS[type as PokemonType] ?? "#888";
}

export function typeLabel(type: string) {
    return TYPE_LABELS[type as PokemonType] ?? type;
}

const DARK_TEXT = "#1b1b1b";
const LIGHT_TEXT = "#ffffff";

function luminance(hex: string) {
    const value = hex.replace("#", "");
    const full = value.length === 3 ? value.replace(/./g, "$&$&") : value.slice(0, 6);
    const [r, g, b] = [0, 2, 4].map((i) => {
        const channel = parseInt(full.slice(i, i + 2), 16) / 255;
        return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
    const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (light + 0.05) / (dark + 0.05);
}

/** Texto escuro ou branco, o que tiver maior contraste WCAG sobre o fundo (hex). */
export function readableTextColor(background: string) {
    return contrast(background, DARK_TEXT) > contrast(background, LIGHT_TEXT) ? DARK_TEXT : LIGHT_TEXT;
}

const TYPE_TEXT_COLORS = Object.fromEntries(
    TYPES.map((type) => [type, readableTextColor(TYPE_COLORS[type])]),
) as Record<PokemonType, string>;

export function typeTextColor(type: string) {
    return TYPE_TEXT_COLORS[type as PokemonType] ?? readableTextColor(typeColor(type));
}
