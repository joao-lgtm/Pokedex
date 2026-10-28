/**
 * Contador público de visitantes via Abacus (gratuito, sem cadastro).
 * Cada navegador conta uma única vez; nas próximas visitas só lemos o total.
 */
const API = "https://abacus.jasoncameron.dev";
const COUNTER = "joao-lgtm-pokedex/visitors";
const VISITED_KEY = "@Pokedex:visited";

let pending: Promise<number> | null = null;

function alreadyCounted() {
    // em desenvolvimento só lemos, para não inflar o total
    if (import.meta.env.DEV) return true;
    try {
        return localStorage.getItem(VISITED_KEY) === "1";
    } catch {
        return false;
    }
}

async function request(action: "hit" | "get") {
    const response = await fetch(`${API}/${action}/${COUNTER}`);
    if (!response.ok) throw new Error(`visitors: ${response.status}`);
    const { value } = (await response.json()) as { value: number };
    return value;
}

export function loadVisitors(): Promise<number> {
    // StrictMode monta os efeitos duas vezes: uma única requisição por carregamento
    pending ??= (alreadyCounted() ? request("get") : request("hit").then((value) => {
        try { localStorage.setItem(VISITED_KEY, "1"); } catch { /* sem storage */ }
        return value;
    })).catch((error) => {
        pending = null;
        throw error;
    });
    return pending;
}
