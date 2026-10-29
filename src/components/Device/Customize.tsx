import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { STICKERS, StickerArt } from "./stickers";
import { POKEDEX_COLORS } from "./colors";
import { ROTOM_COLORS } from "../Rotom/colors";
import { useDevice } from "../../hooks/useDevice";
import { CustomizePanel } from "./style";

const TITLES = { pokedex: "Minha Pokédex", rotom: "Minha Rotom" };
// motion sobre o styled-component (styled(motion.aside) deixa a checagem de tipos muito lenta)
const Panel = motion.create(CustomizePanel);

/** Painel de cor + adesivos do aparelho na tela (Pokédex ou Rotom); renderizar dentro de #screen. */
export function Customize({ onClose }: { onClose: () => void }) {
    const { device, profile, updateProfile, addSticker, setStickerEdit, screenRef } = useDevice();
    const colors = device === "rotom" ? ROTOM_COLORS : POKEDEX_COLORS;
    const [mobile] = useState(() => window.matchMedia("(max-width: 859px)").matches);
    // ancora o painel na parte visível da tela rolável
    const [placement] = useState(() => {
        const screen = screenRef.current;
        const height = Math.min(560, (screen?.clientHeight ?? 560) - 12);
        return { top: (screen?.scrollTop ?? 0) + Math.max(0, (screen?.clientHeight ?? height) - height - 6), maxHeight: height, bottom: "auto" };
    });
    const close = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        const previous = document.activeElement as HTMLElement | null;
        setStickerEdit(true);
        close.current?.focus({ preventScroll: true });
        function escape(event: KeyboardEvent) { if (event.key === "Escape") { event.stopPropagation(); onClose(); } }
        document.addEventListener("keydown", escape);
        return () => { setStickerEdit(false); document.removeEventListener("keydown", escape); previous?.focus({ preventScroll: true }); };
    }, [setStickerEdit, onClose]);
    return <Panel style={placement} role="dialog" aria-label={`Customizar ${device === "rotom" ? "Rotom" : "Pokédex"}`} initial={{ opacity: 0, x: mobile ? 0 : 40, y: mobile ? 40 : 0 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: mobile ? 0 : 40, y: mobile ? 40 : 0 }} transition={{ duration: .2 }}>
        <div className="panel-heading"><h2>{TITLES[device]}</h2><button ref={close} onClick={onClose} aria-label="Fechar customização">✕</button></div>
        <p>Arraste os adesivos no chassi • toque duas vezes para remover</p>
        <h3>Cor da carcaça</h3><div className="custom-colors">{colors.map((color) => <button key={color.value} aria-label={color.name} aria-pressed={profile.color === color.value} onClick={() => updateProfile({ color: color.value })}><i style={{ background: color.value }} />{color.name}</button>)}</div>
        <h3>Adesivos</h3><div className="sticker-catalog">{STICKERS.map((sticker) => <button key={sticker.kind} onClick={() => addSticker(sticker.kind)} aria-label={`Adicionar ${sticker.label}`}><StickerArt kind={sticker.kind} size={40} /><span>{sticker.label}</span></button>)}</div>
        <button onClick={() => updateProfile({ stickers: [] })} disabled={!profile.stickers.length}>Limpar adesivos</button>
    </Panel>;
}
