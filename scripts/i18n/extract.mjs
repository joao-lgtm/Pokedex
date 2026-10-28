// Baixa da PokeAPI os textos em inglês que precisam de tradução para pt-BR.
// Uso: node scripts/i18n/extract.mjs  ->  scripts/i18n/source/*.json
import { mkdir, writeFile } from "node:fs/promises";

const API = "https://pokeapi.co/api/v2/";
const MAX = 1025;
const OUT = new URL("./source/", import.meta.url);

const clean = (text) => text.replace(/[\f\n\r­]+/g, " ").replace(/\s+/g, " ").trim();

async function get(path, tries = 3) {
    for (let i = 0; ; i++) {
        try {
            const response = await fetch(path.startsWith("http") ? path : API + path);
            if (!response.ok) throw new Error(`${response.status} ${path}`);
            return await response.json();
        } catch (error) {
            if (i >= tries) throw error;
            await new Promise((r) => setTimeout(r, 500 * (i + 1)));
        }
    }
}

async function pool(items, size, work) {
    const results = new Array(items.length);
    let next = 0;
    await Promise.all(Array.from({ length: size }, async () => {
        while (next < items.length) {
            const index = next++;
            results[index] = await work(items[index]);
        }
    }));
    return results;
}

const ids = Array.from({ length: MAX }, (_, i) => i + 1);
const species = await pool(ids, 16, async (id) => {
    const data = await get(`pokemon-species/${id}`);
    const english = data.flavor_text_entries.filter((e) => e.language.name === "en");
    // a entrada mais recente costuma ser a mais bem escrita
    const flavor = english.length ? clean(english[english.length - 1].flavor_text) : "";
    const genus = data.genera.find((g) => g.language.name === "en")?.genus ?? "";
    return { id, name: data.name, genus, flavor };
});

const list = await get("ability?limit=400");
const abilities = await pool(list.results, 16, async ({ name, url }) => {
    const data = await get(url);
    return { name, en: data.names.find((n) => n.language.name === "en")?.name ?? name };
});

await mkdir(OUT, { recursive: true });
await writeFile(new URL("species.json", OUT), JSON.stringify(species, null, 1));
await writeFile(new URL("abilities.json", OUT), JSON.stringify(abilities, null, 1));
console.log(`espécies: ${species.length}, habilidades: ${abilities.length}`);
