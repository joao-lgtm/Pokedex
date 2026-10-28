import type { StickerKind } from "../components/Device/stickers";

export type RotomSticker = {
    id: string;
    kind: StickerKind;
    /** Posição relativa à carcaça (0..1), independe do tamanho da tela. */
    x: number;
    y: number;
    rotate: number;
    scale: number;
};

export type RotomProfile = {
    color: string;
    stickers: RotomSticker[];
};

/**
 * Onde o perfil da Rotom fica salvo. Hoje: sessionStorage.
 * Para escalar (conta de usuário, back-end), basta outra implementação
 * desta interface, ex.: `httpRepository` com GET/PUT em /api/rotom-profile.
 */
export interface RotomProfileRepository {
    /** Leitura síncrona opcional, evita "piscar" a cor padrão no primeiro render. */
    peek?(): RotomProfile | null;
    load(): Promise<RotomProfile | null>;
    save(profile: RotomProfile): Promise<void>;
}

const SESSION_KEY = "@Pokedex:rotom:v1";

function parse(raw: string | null): RotomProfile | null {
    if (!raw) return null;
    try {
        const data = JSON.parse(raw) as Partial<RotomProfile>;
        if (typeof data.color !== "string" || !Array.isArray(data.stickers)) return null;
        return { color: data.color, stickers: data.stickers };
    } catch {
        return null;
    }
}

export const sessionRepository: RotomProfileRepository = {
    peek() {
        try {
            return parse(sessionStorage.getItem(SESSION_KEY));
        } catch {
            return null;
        }
    },
    async load() {
        return this.peek?.() ?? null;
    },
    async save(profile) {
        try {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(profile));
        } catch {
            // sessão bloqueada: segue só em memória
        }
    },
};

/** Repositório ativo da aplicação: troque aqui quando houver back-end. */
export const rotomRepository: RotomProfileRepository = sessionRepository;
