import { useRef, type PointerEvent } from "react";
import styled, { css, keyframes } from "styled-components";
import { useDevice } from "../../hooks/useDevice";
import type { DeviceSticker } from "../../services/deviceProfile";
import { StickerArt } from "./stickers";

const stick = keyframes`
    0%   { transform: translate(-50%, -50%) rotate(var(--rotate)) scale(1.9); opacity: 0; filter: drop-shadow(0 18px 12px rgba(0, 0, 0, .35)); }
    70%  { transform: translate(-50%, -50%) rotate(var(--rotate)) scale(.92); opacity: 1; }
    100% { transform: translate(-50%, -50%) rotate(var(--rotate)) scale(1); }
`;

const wiggle = keyframes`
    0%, 100% { rotate: 0deg; }
    50% { rotate: 4deg; }
`;

const Layer = styled.div<{ $edit: boolean }>`
    position: absolute;
    inset: 0;
    z-index: 15;
    pointer-events: none;
    border-radius: inherit;

    ${({ $edit }) => $edit && css`
        outline: 2px dashed rgba(255, 255, 255, .55);
        outline-offset: -8px;
    `}
`;

const Item = styled.button<{ $edit: boolean }>`
    --rotate: 0deg;
    position: absolute;
    width: 46px;
    height: 46px;
    padding: 0;
    transform: translate(-50%, -50%) rotate(var(--rotate)) scale(var(--scale, 1));
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, .35));
    animation: ${stick} .45s cubic-bezier(.3, 1.4, .5, 1) backwards;
    pointer-events: ${({ $edit }) => ($edit ? "auto" : "none")};
    touch-action: none;
    cursor: ${({ $edit }) => ($edit ? "grab" : "default")};

    svg { width: 100%; height: 100%; }

    ${({ $edit }) => $edit && css`
        > svg { animation: ${wiggle} 1.4s ease-in-out infinite; }
        &:active { cursor: grabbing; filter: drop-shadow(0 10px 8px rgba(0, 0, 0, .4)); }
    `}

    @media (max-width: 720px) {
        width: 34px;
        height: 34px;
    }
`;

function Sticker({ sticker, edit }: { sticker: DeviceSticker; edit: boolean }) {
    const { updateSticker, removeSticker } = useDevice();
    const ref = useRef<HTMLButtonElement>(null);
    const drag = useRef<{ startX: number; startY: number; moved: boolean } | null>(null);
    const lastTap = useRef(0);

    function onPointerDown(event: PointerEvent<HTMLButtonElement>) {
        if (!edit) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = { startX: event.clientX, startY: event.clientY, moved: false };
    }

    // durante o arraste só mexe no estilo; grava a posição ao soltar
    function onPointerMove(event: PointerEvent<HTMLButtonElement>) {
        const el = ref.current;
        const layer = el?.parentElement;
        if (!drag.current || !el || !layer) return;
        const rect = layer.getBoundingClientRect();
        const x = Math.min(0.98, Math.max(0.02, (event.clientX - rect.left) / rect.width));
        const y = Math.min(0.98, Math.max(0.02, (event.clientY - rect.top) / rect.height));
        if (Math.abs(event.clientX - drag.current.startX) + Math.abs(event.clientY - drag.current.startY) > 4) {
            drag.current.moved = true;
        }
        el.style.left = `${x * 100}%`;
        el.style.top = `${y * 100}%`;
        el.dataset.x = String(x);
        el.dataset.y = String(y);
    }

    function onPointerUp() {
        const el = ref.current;
        if (!drag.current || !el) return;
        const { moved } = drag.current;
        drag.current = null;
        if (moved && el.dataset.x) {
            updateSticker(sticker.id, { x: Number(el.dataset.x), y: Number(el.dataset.y) });
            return;
        }
        // toque duplo remove
        const now = performance.now();
        if (now - lastTap.current < 320) removeSticker(sticker.id);
        lastTap.current = now;
    }

    return (
        <Item
            ref={ref}
            $edit={edit}
            tabIndex={edit ? 0 : -1}
            aria-label={edit ? "Adesivo: arraste para mover, toque duas vezes para remover" : undefined}
            aria-hidden={!edit}
            data-dpad-skip={edit ? undefined : ""}
            style={{
                left: `${sticker.x * 100}%`,
                top: `${sticker.y * 100}%`,
                ["--rotate" as string]: `${sticker.rotate}deg`,
                ["--scale" as string]: sticker.scale,
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={(event) => (event.key === "Delete" || event.key === "Backspace") && removeSticker(sticker.id)}
        >
            <StickerArt kind={sticker.kind} size={46} />
        </Item>
    );
}

export function StickerLayer() {
    const { profile, stickerEdit } = useDevice();
    if (!profile.stickers.length && !stickerEdit) return null;

    return (
        <Layer $edit={stickerEdit}>
            {profile.stickers.map((sticker) => (
                <Sticker key={sticker.id} sticker={sticker} edit={stickerEdit} />
            ))}
        </Layer>
    );
}
