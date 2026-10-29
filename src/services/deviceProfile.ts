import type { StickerKind } from "../components/Device/stickers";

/** Os dois aparelhos customizáveis: a Pokédex (Home/Detalhe) e a Rotom (Quiz). */
export type DeviceKind = "pokedex" | "rotom";

export type DeviceSticker = {
    id: string;
    kind: StickerKind;
    /** Posição relativa à carcaça (0..1), independe do tamanho da tela. */
    x: number;
    y: number;
    rotate: number;
    scale: number;
};

export type DeviceProfile = {
    color: string;
    stickers: DeviceSticker[];
};

/**
 * Onde o perfil de um aparelho fica salvo. Hoje: sessionStorage.
 * Para escalar (conta de usuário, back-end), basta outra implementação
 * desta interface, ex.: `httpRepository` com GET/PUT em /api/profile/:device.
 */
export interface DeviceProfileRepository {
    /** Leitura síncrona opcional, evita "piscar" a cor padrão no primeiro render. */
    peek?(): DeviceProfile | null;
    load(): Promise<DeviceProfile | null>;
    save(profile: DeviceProfile): Promise<void>;
}

function parse(raw: string | null): DeviceProfile | null {
    if (!raw) return null;
    try {
        const data = JSON.parse(raw) as Partial<DeviceProfile>;
        if (typeof data.color !== "string" || !Array.isArray(data.stickers)) return null;
        return { color: data.color, stickers: data.stickers };
    } catch {
        return null;
    }
}

export function sessionRepository(key: string): DeviceProfileRepository {
    return {
        peek() {
            try {
                return parse(sessionStorage.getItem(key));
            } catch {
                return null;
            }
        },
        async load() {
            return this.peek?.() ?? null;
        },
        async save(profile) {
            try {
                sessionStorage.setItem(key, JSON.stringify(profile));
            } catch {
                // sessão bloqueada: segue só em memória
            }
        },
    };
}

/** Repositórios ativos da aplicação: troque aqui quando houver back-end. */
export const profileRepositories: Record<DeviceKind, DeviceProfileRepository> = {
    pokedex: sessionRepository("@Pokedex:pokedex:v1"),
    rotom: sessionRepository("@Pokedex:rotom:v1"),
};
