import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import { cryUrl } from "../services/pokeapi";
import { rotomRepository, type RotomProfile, type RotomSticker } from "../services/rotomProfile";
import type { StickerKind } from "../components/Device/stickers";

export type ControlKey = "up" | "down" | "left" | "right" | "a" | "b" | "start" | "select";
export type ControlHandlers = Partial<Record<ControlKey, () => void>>;

type DeviceContextType = {
    /** Container rolável da tela da Pokédex. */
    screenRef: React.RefObject<HTMLDivElement>;
    /** Handlers dos botões físicos registrados pela página atual. */
    controlsRef: React.MutableRefObject<ControlHandlers>;
    /** Elemento da lente azul: recebe a variável CSS --lens-level (0..1). */
    lensRef: React.RefObject<HTMLDivElement>;
    setLensLevel: (level: number) => void;
    /** Pisca a lente e os LEDs (ex.: carregando, acerto). */
    blink: (kind?: "busy" | "success" | "error") => void;
    /** Toca o cry do Pokémon e faz a lente pulsar com o volume do áudio. */
    playCry: (id: number) => Promise<void>;
    /** Cor da carcaça no modo Rotom (null = cor padrão da Rotom). */
    shellColor: string | null;
    setShellColor: (color: string | null) => void;
    /** Expressão dos olhos da Rotom no chassi. */
    mood: RotomMood;
    setMood: (mood: RotomMood) => void;
    /** Volume dos cries (0..1). A lente reage ao áudio antes do ganho. */
    volume: number;
    setVolume: (volume: number) => void;
    /** Perfil da Rotom (cor + adesivos), persistido pelo rotomRepository. */
    rotom: RotomProfile;
    updateRotom: (patch: Partial<RotomProfile>) => void;
    addSticker: (kind: StickerKind) => void;
    updateSticker: (id: string, patch: Partial<RotomSticker>) => void;
    removeSticker: (id: string) => void;
    /** Com true, os adesivos podem ser arrastados/removidos direto no chassi. */
    stickerEdit: boolean;
    setStickerEdit: (on: boolean) => void;
};

export type RotomMood = "idle" | "happy" | "wrong";

export const ROTOM_DEFAULT = "#e8433f";
export const DEFAULT_VOLUME = 0.15;
const VOLUME_KEY = "@Pokedex:volume";

function readVolume() {
    try {
        const saved = localStorage.getItem(VOLUME_KEY);
        const value = saved === null ? NaN : Number(saved);
        return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : DEFAULT_VOLUME;
    } catch {
        return DEFAULT_VOLUME;
    }
}

const MAX_STICKERS = 24;

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

let audioContext: AudioContext | null = null;
const cryBuffers = new Map<number, Promise<AudioBuffer>>();

function getAudioContext() {
    audioContext ??= new AudioContext();
    if (audioContext.state === "suspended") audioContext.resume();
    return audioContext;
}

function loadCry(id: number) {
    let buffer = cryBuffers.get(id);
    if (!buffer) {
        buffer = fetch(cryUrl(id))
            .then((response) => response.arrayBuffer())
            .then((data) => getAudioContext().decodeAudioData(data));
        buffer.catch(() => cryBuffers.delete(id));
        cryBuffers.set(id, buffer);
    }
    return buffer;
}

export function DeviceProvider({ children }: { children: ReactNode }) {
    const lensRef = useRef<HTMLDivElement>(null);
    const screenRef = useRef<HTMLDivElement>(null);
    const controlsRef = useRef<ControlHandlers>({});
    const [rotom, setRotom] = useState<RotomProfile>(
        () => rotomRepository.peek?.() ?? { color: ROTOM_DEFAULT, stickers: [] },
    );
    const [stickerEdit, setStickerEdit] = useState(false);
    const [volume, setVolumeState] = useState(readVolume);
    const gain = useRef<GainNode | null>(null);
    const [mood, setMoodState] = useState<RotomMood>("idle");

    useEffect(() => {
        if (rotomRepository.peek) return;
        rotomRepository.load().then((saved) => saved && setRotom(saved)).catch(() => undefined);
    }, []);

    // salva com pequeno atraso: arrastar adesivo não grava a cada quadro
    useEffect(() => {
        const timer = setTimeout(() => rotomRepository.save(rotom).catch(() => undefined), 250);
        return () => clearTimeout(timer);
    }, [rotom]);

    const updateRotom = useCallback((patch: Partial<RotomProfile>) => {
        setRotom((current) => ({ ...current, ...patch }));
    }, []);

    const addSticker = useCallback((kind: StickerKind) => {
        setRotom((current) => {
            const sticker: RotomSticker = {
                id: `${kind}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
                kind,
                x: 0.08 + Math.random() * 0.84,
                y: 0.06 + Math.random() * 0.12,
                rotate: Math.round(Math.random() * 40 - 20),
                scale: 1,
            };
            return { ...current, stickers: [...current.stickers, sticker].slice(-MAX_STICKERS) };
        });
    }, []);

    const updateSticker = useCallback((id: string, patch: Partial<RotomSticker>) => {
        setRotom((current) => ({
            ...current,
            stickers: current.stickers.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        }));
    }, []);

    const removeSticker = useCallback((id: string) => {
        setRotom((current) => ({ ...current, stickers: current.stickers.filter((s) => s.id !== id) }));
    }, []);

    const setShellColor = useCallback((color: string | null) => {
        updateRotom({ color: color ?? ROTOM_DEFAULT });
    }, [updateRotom]);

    const setVolume = useCallback((next: number) => {
        const value = Math.min(1, Math.max(0, next));
        setVolumeState(value);
        if (gain.current) gain.current.gain.value = value;
        try { localStorage.setItem(VOLUME_KEY, String(value)); } catch { /* sem storage */ }
    }, []);
    const volumeRef = useRef(volume);
    volumeRef.current = volume;
    const moodTimer = useRef(0);

    // reações voltam sozinhas para "idle"
    const setMood = useCallback((next: RotomMood) => {
        clearTimeout(moodTimer.current);
        setMoodState(next);
        if (next !== "idle") moodTimer.current = window.setTimeout(() => setMoodState("idle"), 1400);
    }, []);
    const frame = useRef(0);
    const source = useRef<AudioBufferSourceNode | null>(null);

    const setLensLevel = useCallback((level: number) => {
        lensRef.current?.style.setProperty("--lens-level", level.toFixed(3));
    }, []);

    const blink = useCallback((kind: "busy" | "success" | "error" = "busy") => {
        const lens = lensRef.current;
        if (!lens) return;
        lens.dataset.blink = "";
        void lens.offsetWidth;
        lens.dataset.blink = kind;
    }, []);

    const playCry = useCallback(async (id: number) => {
        const context = getAudioContext();
        let buffer: AudioBuffer;
        try {
            buffer = await loadCry(id);
        } catch {
            blink("error");
            return;
        }

        source.current?.stop();
        cancelAnimationFrame(frame.current);

        const analyser = context.createAnalyser();
        analyser.fftSize = 256;
        const node = context.createBufferSource();
        node.buffer = buffer;
        const output = context.createGain();
        output.gain.value = volumeRef.current;
        node.connect(analyser);
        analyser.connect(output);
        output.connect(context.destination);
        gain.current = output;
        source.current = node;

        const samples = new Uint8Array(analyser.fftSize);
        let smooth = 0;
        const tick = () => {
            analyser.getByteTimeDomainData(samples);
            let peak = 0;
            for (const sample of samples) peak = Math.max(peak, Math.abs(sample - 128));
            smooth += (Math.min(1, peak / 64) - smooth) * 0.35;
            setLensLevel(smooth);
            frame.current = requestAnimationFrame(tick);
        };

        node.onended = () => {
            cancelAnimationFrame(frame.current);
            setLensLevel(0);
        };
        node.start();
        tick();
    }, [blink, setLensLevel]);

    const value = useMemo(
        () => ({
            screenRef, controlsRef, lensRef, setLensLevel, blink, playCry,
            shellColor: rotom.color, setShellColor, mood, setMood, volume, setVolume,
            rotom, updateRotom, addSticker, updateSticker, removeSticker, stickerEdit, setStickerEdit,
        }),
        [setLensLevel, blink, playCry, rotom, setShellColor, mood, setMood, volume, setVolume,
            updateRotom, addSticker, updateSticker, removeSticker, stickerEdit],
    );

    return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
}

export function useDevice() {
    const context = useContext(DeviceContext);
    if (!context) throw new Error("useDevice must be used within a DeviceProvider");
    return context;
}

/** Registra o que o D-pad e os botões A/B/Start/Select fazem na página atual. */
export function useControls(handlers: ControlHandlers) {
    const { controlsRef } = useDevice();
    const latest = useRef(handlers);
    latest.current = handlers;

    useEffect(() => {
        const proxy: ControlHandlers = {};
        for (const key of Object.keys(latest.current) as ControlKey[]) {
            proxy[key] = () => latest.current[key]?.();
        }
        controlsRef.current = proxy;
        return () => {
            if (controlsRef.current === proxy) controlsRef.current = {};
        };
    }, [controlsRef]);
}

/**
 * Navegação com View Transitions API quando disponível: a tela "troca de canal"
 * e elementos com o mesmo view-transition-name (ex.: arte do Pokémon) voam entre as páginas.
 */
export function useScreenNavigate() {
    const navigate = useNavigate();

    return useCallback((to: string | number, options?: { replace?: boolean }) => {
        const go = () => (typeof to === "number" ? navigate(to) : navigate(to, options));
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!document.startViewTransition || reduced) {
            go();
            return;
        }
        if (typeof to === "number") {
            // voltar no histórico dispara popstate de forma assíncrona
            document.startViewTransition(() => new Promise<void>((resolve) => {
                window.addEventListener("popstate", () => setTimeout(resolve, 20), { once: true });
                setTimeout(resolve, 400);
                go();
            }));
            return;
        }
        document.startViewTransition(() => flushSync(go));
    }, [navigate]);
}
