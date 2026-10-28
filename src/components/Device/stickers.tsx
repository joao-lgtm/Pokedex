export type StickerKind =
    | "pokeball" | "star" | "bolt" | "heart" | "flame" | "leaf" | "drop" | "moon" | "crown" | "sparkle";

export const STICKERS: Array<{ kind: StickerKind; label: string }> = [
    { kind: "pokeball", label: "Pokébola" },
    { kind: "star", label: "Estrela" },
    { kind: "bolt", label: "Raio" },
    { kind: "heart", label: "Coração" },
    { kind: "flame", label: "Chama" },
    { kind: "leaf", label: "Folha" },
    { kind: "drop", label: "Gota" },
    { kind: "moon", label: "Lua" },
    { kind: "crown", label: "Coroa" },
    { kind: "sparkle", label: "Brilho" },
];

const OUTLINE = { stroke: "#1b1b1b", strokeWidth: 3, strokeLinejoin: "round" as const };

function Shape({ kind }: { kind: StickerKind }) {
    switch (kind) {
        case "pokeball":
            return (
                <>
                    <circle cx="24" cy="24" r="19" fill="#fff" {...OUTLINE} />
                    <path d="M5 24a19 19 0 0 1 38 0Z" fill="#e3102a" {...OUTLINE} />
                    <circle cx="24" cy="24" r="6" fill="#fff" {...OUTLINE} />
                </>
            );
        case "star":
            return <path d="M24 4l6 13 14 1.5-10.5 9.5 3 14L24 35l-12.5 7 3-14L4 18.5 18 17z" fill="#ffd23f" {...OUTLINE} />;
        case "bolt":
            return <path d="M27 3L9 27h12l-4 18 22-26H26z" fill="#f7d02c" {...OUTLINE} />;
        case "heart":
            return <path d="M24 42S5 30 5 17a10 10 0 0 1 19-4 10 10 0 0 1 19 4c0 13-19 25-19 25z" fill="#ff5c8a" {...OUTLINE} />;
        case "flame":
            return <path d="M24 44c-9 0-15-6-15-14 0-9 8-13 9-23 5 4 7 9 6 14 2-2 4-4 4-8 6 5 11 11 11 18 0 8-6 13-15 13z" fill="#ee8130" {...OUTLINE} />;
        case "leaf":
            return <path d="M8 40C6 20 20 6 42 6c0 22-14 36-34 34zm0 0L26 22" fill="#7ac74c" {...OUTLINE} />;
        case "drop":
            return <path d="M24 4C18 16 10 22 10 31a14 14 0 0 0 28 0c0-9-8-15-14-27z" fill="#6390f0" {...OUTLINE} />;
        case "moon":
            return <path d="M30 5a19 19 0 1 0 13 28A16 16 0 0 1 30 5z" fill="#c9b6ff" {...OUTLINE} />;
        case "crown":
            return <path d="M6 36l-2-22 11 9 9-15 9 15 11-9-2 22z" fill="#ffd23f" {...OUTLINE} />;
        case "sparkle":
            return <path d="M24 3c2 11 8 17 19 21-11 4-17 10-19 21-2-11-8-17-19-21 11-4 17-10 19-21z" fill="#96d9d6" {...OUTLINE} />;
    }
}

export function StickerArt({ kind, size = 40 }: { kind: StickerKind; size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden focusable="false">
            {/* borda branca de adesivo recortado */}
            <g style={{ filter: "drop-shadow(0 0 0 #fff) drop-shadow(0 1.5px 0 #fff) drop-shadow(0 -1.5px 0 #fff) drop-shadow(1.5px 0 0 #fff) drop-shadow(-1.5px 0 0 #fff)" }}>
                <Shape kind={kind} />
            </g>
        </svg>
    );
}
