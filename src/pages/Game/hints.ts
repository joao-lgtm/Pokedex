import type { PokemonDetail } from "../../services/pokeapi";
import { typeLabel } from "../../style/types";

export type Mode = "easy" | "medium" | "hard";
export const MODES: Array<{ id: Mode; label: string; description: string; cost: number }> = [
    { id: "easy", label: "Fácil", description: "Silhueta ligada, dicas diretas e nenhuma vida para ligar a TV.", cost: 0 },
    { id: "medium", label: "Médio", description: "Comece pelas pistas. Ver a silhueta custa 1 vida.", cost: 1 },
    { id: "hard", label: "Difícil", description: "Só pistas vagas da Pokédex. Ver a silhueta custa 2 vidas.", cost: 2 },
];
const colors: Record<string, string> = { black: "preta", blue: "azul", brown: "marrom", gray: "cinza", green: "verde", pink: "rosa", purple: "roxa", red: "vermelha", white: "branca", yellow: "amarela" };
const habitats: Record<string, string> = { cave: "cavernas", forest: "florestas", grassland: "campos", mountain: "montanhas", rare: "locais raros", "rough-terrain": "terrenos acidentados", sea: "mares", "urban": "áreas urbanas", "waters-edge": "margens de rios e lagos" };
const shapes: Record<string, string> = { ball: "arredondado", squiggle: "alongado", fish: "de peixe", arms: "com braços", blob: "amorfo", upright: "bípede com cauda", legs: "bípede", quadruped: "quadrúpede", wings: "com duas asas", tentacles: "com tentáculos", heads: "com várias cabeças", humanoid: "humanoide", "bug-wings": "com quatro asas", armor: "de inseto" };
export function censor(text: string, name: string) {
    const variants = [name, name.replace(/-/g, " "), ...name.split("-").filter((part) => part.length > 2)];
    return variants.reduce((value, part) => value.replace(new RegExp(part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "▇▇▇"), text);
}
export function buildHints(mode: Mode, detail: PokemonDetail): string[] {
    const types = `Tipos: ${detail.types.map(typeLabel).join(" / ")}.`;
    if (mode === "easy") return [
        `${types} ${detail.generation}ª geração.`,
        `O nome começa com ${detail.name[0].toUpperCase()} e tem ${detail.name.replace(/[^a-z]/gi, "").length} letras.`,
        `Uma habilidade: ${detail.abilities[0]?.label ?? "não registrada"}.`,
    ];
    if (mode === "medium") return [types, `Geração: ${detail.generation}ª · Categoria: ${censor(detail.genus || "não registrada", detail.name)}.`, `Altura: ${detail.height.toLocaleString("pt-BR")} m · Peso: ${detail.weight.toLocaleString("pt-BR")} kg.`];
    return [
        `Entrada da Pokédex: ${censor(detail.flavorTexts[0] || detail.flavorText || "Nenhuma observação registrada.", detail.name)}`,
        `Habitat: ${detail.habitat ? habitats[detail.habitat] ?? "não catalogado" : "não catalogado"}.`,
        `Formato do corpo: ${detail.shape ? shapes[detail.shape] ?? "não catalogado" : "não catalogado"}.`,
        `Cor predominante: ${colors[detail.color] ?? "não catalogada"}.`,
    ];
}
