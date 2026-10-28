import { TYPES } from "../style/types";

const BASE_URL = "https://pokeapi.co/api/v2/";
const SPRITES = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
const INDEX_KEY = "@Pokedex:index:v2";

export const MAX_POKEMON = 1025;

export type PokemonIndexEntry = {
    id: number;
    name: string;
    types: string[];
};

const memory = new Map<string, Promise<unknown>>();

export function getJSON<T>(path: string): Promise<T> {
    const url = path.startsWith("http") ? path : BASE_URL + path;
    const cached = memory.get(url);
    if (cached) return cached as Promise<T>;

    const request = fetch(url).then((response) => {
        if (!response.ok) throw new Error(`${response.status} em ${url}`);
        return response.json() as Promise<T>;
    });
    request.catch(() => memory.delete(url));
    memory.set(url, request);
    return request;
}

export function idFromUrl(url: string) {
    return Number(url.split("/").filter(Boolean).pop());
}

export function artworkUrl(id: number, shiny = false) {
    return `${SPRITES}/other/official-artwork/${shiny ? "shiny/" : ""}${id}.png`;
}

export function spriteUrl(id: number) {
    return `${SPRITES}/${id}.png`;
}

export function cryUrl(id: number) {
    return `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;
}

export function formatNumber(id: number) {
    return `#${String(id).padStart(4, "0")}`;
}

// grafias oficiais que o slug da PokeAPI perde (pontuação, hífen, acento, símbolo)
const OFFICIAL_NAMES: Record<string, string> = {
    "nidoran-f": "Nidoran♀", "nidoran-m": "Nidoran♂", farfetchd: "Farfetch'd", sirfetchd: "Sirfetch'd",
    "mr-mime": "Mr. Mime", "mime-jr": "Mime Jr.", "mr-rime": "Mr. Rime", "type-null": "Type: Null",
    "ho-oh": "Ho-Oh", "porygon-z": "Porygon-Z", flabebe: "Flabébé",
    "jangmo-o": "Jangmo-o", "hakamo-o": "Hakamo-o", "kommo-o": "Kommo-o",
    "wo-chien": "Wo-Chien", "chien-pao": "Chien-Pao", "ting-lu": "Ting-Lu", "chi-yu": "Chi-Yu",
};

export function formatName(name: string) {
    if (OFFICIAL_NAMES[name]) return OFFICIAL_NAMES[name];
    return name
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

type NamedList = { results: Array<{ name: string; url: string }> };
type TypeResponse = { pokemon: Array<{ slot: number; pokemon: { name: string; url: string } }> };

let indexPromise: Promise<PokemonIndexEntry[]> | null = null;

/**
 * Monta o índice completo (id, nome, tipos) com ~19 requisições em paralelo,
 * em vez de 2 requisições por Pokémon. Fica salvo no localStorage.
 */
export function loadPokemonIndex(): Promise<PokemonIndexEntry[]> {
    if (indexPromise) return indexPromise;

    const saved = readSavedIndex();
    if (saved) {
        indexPromise = Promise.resolve(saved);
        return indexPromise;
    }

    indexPromise = (async () => {
        const [species, ...typeLists] = await Promise.all([
            getJSON<NamedList>(`pokemon-species?limit=${MAX_POKEMON}`),
            ...TYPES.map((type) => getJSON<TypeResponse>(`type/${type}`)),
        ]);

        const typesById = new Map<number, Array<{ slot: number; type: string }>>();
        typeLists.forEach((list, index) => {
            for (const { slot, pokemon } of list.pokemon) {
                const id = idFromUrl(pokemon.url);
                if (id > MAX_POKEMON) continue;
                const entry = typesById.get(id) ?? [];
                entry.push({ slot, type: TYPES[index] });
                typesById.set(id, entry);
            }
        });

        const entries = species.results.map(({ name, url }) => {
            const id = idFromUrl(url);
            const types = (typesById.get(id) ?? [])
                .sort((a, b) => a.slot - b.slot)
                .map((t) => t.type);
            return { id, name, types };
        });

        try {
            localStorage.setItem(INDEX_KEY, JSON.stringify(entries));
            localStorage.removeItem("@Pokemon:pokemons");
            localStorage.removeItem("@Pokemon:count");
        } catch {
            // armazenamento cheio ou bloqueado: segue só com memória
        }
        return entries;
    })();

    indexPromise.catch(() => (indexPromise = null));
    return indexPromise;
}

function readSavedIndex(): PokemonIndexEntry[] | null {
    try {
        const raw = localStorage.getItem(INDEX_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as PokemonIndexEntry[];
        return parsed.length >= MAX_POKEMON ? parsed : null;
    } catch {
        return null;
    }
}

// ---- Traduções pt-BR ----
// A PokeAPI não tem português: textos traduzidos ficam em public/data/pt-BR
// (gerados por scripts/i18n). Sem o arquivo, cai para es/en.

type Translations = { pokedex: Record<string, [string, string]>; abilities: Record<string, string> };
let translations: Promise<Translations | null> | null = null;

export function loadTranslations() {
    translations ??= Promise.all([
        fetch(`${import.meta.env.BASE_URL}data/pt-BR/pokedex.json`).then((r) => (r.ok ? r.json() : {})),
        fetch(`${import.meta.env.BASE_URL}data/pt-BR/abilities.json`).then((r) => (r.ok ? r.json() : {})),
    ])
        .then(([pokedex, abilities]) => ({ pokedex, abilities }))
        .catch(() => null);
    return translations;
}

// ---- Detalhe ----

export type PokemonDetail = {
    id: number;
    name: string;
    height: number;
    weight: number;
    types: string[];
    stats: Array<{ name: string; value: number }>;
    /** label: nome em pt-BR (dataset local), com fallback para o nome da PokeAPI. */
    abilities: Array<{ name: string; label: string; hidden: boolean }>;
    genus: string;
    flavorText: string;
    evolutionChainUrl: string | null;
    captureRate: number;
    isLegendary: boolean;
    isMythical: boolean;
    /** Dados da espécie usados nas dicas do quiz. */
    color: string;
    habitat: string | null;
    shape: string | null;
    generation: number;
    flavorTexts: string[];
};

type PokemonResponse = {
    id: number;
    name: string;
    height: number;
    weight: number;
    types: Array<{ slot: number; type: { name: string } }>;
    stats: Array<{ base_stat: number; stat: { name: string } }>;
    abilities: Array<{ is_hidden: boolean; ability: { name: string } }>;
};

type SpeciesResponse = {
    capture_rate: number;
    is_legendary: boolean;
    is_mythical: boolean;
    evolution_chain: { url: string } | null;
    genera: Array<{ genus: string; language: { name: string } }>;
    flavor_text_entries: Array<{ flavor_text: string; language: { name: string } }>;
    color: { name: string } | null;
    habitat: { name: string } | null;
    shape: { name: string } | null;
    generation: { name: string } | null;
};

const ROMAN: Record<string, number> = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9 };

function cleanFlavor(text: string) {
    return text.replace(/[\f\n\r\u00ad]+/g, " ").replace(/\s+/g, " ").trim();
}

function distinctFlavors(entries: SpeciesResponse["flavor_text_entries"]) {
    const preferred = entries.filter((e) => e.language.name === "es");
    const list = preferred.length ? preferred : entries.filter((e) => e.language.name === "en");
    return [...new Set(list.map((e) => cleanFlavor(e.flavor_text)))].slice(0, 3);
}

function pickLanguage<T extends { language: { name: string } }>(list: T[]) {
    return list.find((item) => item.language.name === "es") ?? list.find((item) => item.language.name === "en");
}

export async function loadPokemonDetail(idOrName: number | string): Promise<PokemonDetail> {
    const key = String(idOrName).toLowerCase();
    const pokemon = await getJSON<PokemonResponse>(`pokemon/${key}`);
    const [species, pt] = await Promise.all([
        getJSON<SpeciesResponse>(`pokemon-species/${pokemon.id}`).catch(() => null),
        loadTranslations(),
    ]);
    const [ptGenus, ptFlavor] = pt?.pokedex[pokemon.id] ?? ["", ""];

    const flavor = species ? pickLanguage(species.flavor_text_entries) : undefined;
    const genus = species ? pickLanguage(species.genera) : undefined;

    return {
        id: pokemon.id,
        name: pokemon.name,
        height: pokemon.height / 10,
        weight: pokemon.weight / 10,
        types: [...pokemon.types].sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
        stats: pokemon.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
        abilities: pokemon.abilities.map((a) => ({
            name: a.ability.name,
            label: pt?.abilities[a.ability.name] ?? formatName(a.ability.name),
            hidden: a.is_hidden,
        })),
        genus: ptGenus || genus?.genus || "",
        flavorText: ptFlavor || cleanFlavor(flavor?.flavor_text ?? ""),
        evolutionChainUrl: species?.evolution_chain?.url ?? null,
        captureRate: species?.capture_rate ?? 0,
        isLegendary: species?.is_legendary ?? false,
        isMythical: species?.is_mythical ?? false,
        color: species?.color?.name ?? "",
        habitat: species?.habitat?.name ?? null,
        shape: species?.shape?.name ?? null,
        generation: ROMAN[species?.generation?.name.replace("generation-", "") ?? ""] ?? 0,
        // com tradução, as dicas usam só o texto em português
        flavorTexts: ptFlavor ? [ptFlavor] : species ? distinctFlavors(species.flavor_text_entries) : [],
    };
}

type ChainLink = { species: { name: string; url: string }; evolves_to: ChainLink[] };

/** Retorna os estágios da cadeia evolutiva, cada estágio pode ter ramificações. */
export async function loadEvolutionChain(url: string) {
    const { chain } = await getJSON<{ chain: ChainLink }>(url);
    const stages: Array<Array<{ id: number; name: string }>> = [];

    let level: ChainLink[] = [chain];
    while (level.length) {
        stages.push(level.map((link) => ({ id: idFromUrl(link.species.url), name: link.species.name })));
        level = level.flatMap((link) => link.evolves_to);
    }
    return stages;
}

export function preloadImage(src: string) {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
}
