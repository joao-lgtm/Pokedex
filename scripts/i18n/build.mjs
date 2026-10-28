// Junta as traduções em public/data/pt-BR/ (carregado sob demanda pelo app).
// Uso: node scripts/i18n/build.mjs
import { mkdir, readFile, writeFile } from "node:fs/promises";

const read = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
const species = [...await read("./pt-BR/species-1.json"), ...await read("./pt-BR/species-2.json")];
const abilities = await read("./pt-BR/abilities.json");

// formato compacto: { "25": ["Pokémon Rato", "Texto..."] }
const pokedex = {};
for (const { id, genus, flavor } of species) pokedex[id] = [genus, flavor];
const names = Object.fromEntries(abilities.map(({ name, pt }) => [name, pt]));

const out = new URL("../../public/data/pt-BR/", import.meta.url);
await mkdir(out, { recursive: true });
await writeFile(new URL("pokedex.json", out), JSON.stringify(pokedex));
await writeFile(new URL("abilities.json", out), JSON.stringify(names));
console.log(`pokedex: ${Object.keys(pokedex).length} · habilidades: ${Object.keys(names).length}`);
