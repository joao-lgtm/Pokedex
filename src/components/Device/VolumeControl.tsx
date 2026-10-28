import { useEffect, useRef, useState } from "react";
import { FaVolumeDown, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import styled, { keyframes } from "styled-components";
import { useDevice } from "../../hooks/useDevice";

const pop = keyframes`
    from { opacity: 0; transform: translateY(-6px) scale(.92); }
`;

const Wrapper = styled.div`
    position: relative;
`;

const Toggle = styled.button`
    width: 38px;
    aspect-ratio: 1;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: rgba(0, 0, 0, .18);
    color: #fff;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .15);
    transition: transform .15s ease;
    &:active { transform: scale(.9); }

    @media (max-width: 720px) { width: 34px; }
`;

const Panel = styled.div`
    position: absolute;
    right: 0;
    top: calc(100% + 8px);
    z-index: 30;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 14px;
    background: #1b1d24;
    color: #fff;
    box-shadow: 0 12px 30px -10px rgba(0, 0, 0, .6), inset 0 0 0 1px rgba(255, 255, 255, .1);
    transform-origin: top right;
    animation: ${pop} .18s cubic-bezier(.2, .9, .3, 1.2);

    input {
        width: 150px;
        accent-color: ${({ theme }) => theme.lens};
    }

    output {
        min-width: 38px;
        text-align: right;
        font-family: ${({ theme }) => theme.fontPixel};
        font-size: .85rem;
    }
`;

export function VolumeControl() {
    const { volume, setVolume } = useDevice();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const lastAudible = useRef(volume || 0.15);

    useEffect(() => {
        if (volume > 0) lastAudible.current = volume;
    }, [volume]);

    useEffect(() => {
        if (!open) return;
        const close = (event: PointerEvent) => {
            if (!ref.current?.contains(event.target as Node)) setOpen(false);
        };
        window.addEventListener("pointerdown", close);
        return () => window.removeEventListener("pointerdown", close);
    }, [open]);

    const Icon = volume === 0 ? FaVolumeMute : volume < 0.5 ? FaVolumeDown : FaVolumeUp;

    return (
        <Wrapper ref={ref}>
            <Toggle aria-label={`Volume dos cries: ${Math.round(volume * 100)}%`} aria-expanded={open} onClick={() => setOpen(!open)}>
                <Icon size={15} />
            </Toggle>
            {open && (
                <Panel>
                    <button
                        aria-label={volume === 0 ? "Ativar som" : "Silenciar"}
                        onClick={() => setVolume(volume === 0 ? lastAudible.current : 0)}
                    >
                        <Icon size={16} />
                    </button>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={Math.round(volume * 100)}
                        onChange={(event) => setVolume(Number(event.target.value) / 100)}
                        aria-label="Volume dos cries"
                    />
                    <output>{Math.round(volume * 100)}%</output>
                </Panel>
            )}
        </Wrapper>
    );
}
