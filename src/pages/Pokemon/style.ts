import styled, { css, keyframes, type DefaultTheme } from "styled-components";
import { readableTextColor } from "../../style/types";

const DESKTOP = "@media (min-width: 860px)";

// fundo dos controles sobre o visor: no tema claro precisa ser mais escuro para o texto branco
const glass = (alpha: number) => ({ theme }: { theme: DefaultTheme }) =>
    `rgba(0, 0, 0, ${theme.name === "light" ? alpha + 0.24 : alpha})`;
const ring = (alpha: number) => ({ theme }: { theme: DefaultTheme }) =>
    theme.name === "light" ? `rgba(20, 22, 28, ${alpha * 0.8})` : `rgba(255, 255, 255, ${alpha})`;
const REDUCED = "@media (prefers-reduced-motion: reduce)";

const spin = keyframes`
    to { transform: rotate(360deg); }
`;

const scan = keyframes`
    from { transform: translateY(-100%); }
    to { transform: translateY(100%); }
`;

const float = keyframes`
    50% { transform: translateY(-8px); }
`;

const shimmer = keyframes`
    to { background-position: -200% 0; }
`;

const enter = keyframes`
    from { opacity: 0; transform: translateY(14px); }
`;

const flash = keyframes`
    0% { opacity: 0; }
    20% { opacity: .9; }
    100% { opacity: 0; }
`;

const sparkle = keyframes`
    0% { opacity: 0; transform: rotate(var(--a)) translateY(0) scale(0); }
    30% { opacity: 1; }
    100% { opacity: 0; transform: rotate(var(--a)) translateY(var(--r)) scale(1) rotate(90deg); }
`;

const equalize = keyframes`
    0%, 100% { transform: scaleY(.25); }
    50% { transform: scaleY(1); }
`;

const hop = keyframes`
    40% { transform: translateY(-8px) scale(1.06); }
    70% { transform: translateY(1px) scale(.98); }
`;

const blinkCaret = keyframes`
    50% { opacity: 0; }
`;

export const Container = styled.div`
    min-height: 100%;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    align-items: start;
    gap: 14px;
    padding: 0 0 24px;
    touch-action: pan-y;

    ${DESKTOP} {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
        gap: 20px;
        padding: 16px;
    }
`;

// ---- Visor ----

export const Visor = styled.section<{ $color: string }>`
    position: relative;
    isolation: isolate;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 340px;
    border-radius: 0 0 24px 24px;
    background:
        radial-gradient(circle at 50% 52%, ${({ $color }) => $color}cc 0%, ${({ $color }) => $color}55 38%, transparent 72%),
        ${({ theme }) => theme.screenAlt};
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.screenLine}, inset 0 -30px 60px -40px rgba(0, 0, 0, .5);
    transition: background-color .4s ease;

    /* grade do visor */
    &::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        background-image:
            linear-gradient(${({ theme }) => theme.screenLine} 1px, transparent 1px),
            linear-gradient(90deg, ${({ theme }) => theme.screenLine} 1px, transparent 1px);
        background-size: 22px 22px;
        mask-image: radial-gradient(circle at 50% 50%, #000 30%, transparent 75%);
    }

    /* linha de varredura */
    &::after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 2;
        pointer-events: none;
        background: linear-gradient(transparent 0%, rgba(255, 255, 255, .08) 48%, rgba(255, 255, 255, .14) 50%, transparent 52%);
        animation: ${scan} 4.5s linear infinite;
    }

    /* sticky: cabe na altura da tela (--screen-h) para Cry/Shiny nunca ficarem abaixo da dobra */
    ${DESKTOP} {
        position: sticky;
        top: 16px;
        height: clamp(290px, calc(var(--screen-h, 512px) - 32px), 560px);
        border-radius: 22px;
    }

    ${REDUCED} {
        &::after { animation: none; opacity: 0; }
    }
`;

export const VisorTop = styled.div`
    position: relative;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px 0;

    .number {
        font-family: ${({ theme }) => theme.fontPixel};
        font-size: 1rem;
        padding: 4px 10px;
        border-radius: 999px;
        background: ${glass(0.28)};
        color: #fff;
    }
`;

export const IconButton = styled.button`
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    color: #fff;
    background: ${glass(0.28)};
    transition: transform .15s ease, background-color .2s ease;

    &:active { transform: scale(.9); }
    @media (hover: hover) { &:hover { background: ${glass(0.42)}; } }
`;

export const Rings = styled.div`
    position: absolute;
    inset: 0;
    z-index: -1;
    display: grid;
    place-items: center;
    pointer-events: none;

    span {
        grid-area: 1 / 1;
        border-radius: 50%;
        border: 2px dashed ${ring(0.22)};
        animation: ${spin} 24s linear infinite;
    }

    span:nth-child(1) { width: 200px; height: 200px; }
    span:nth-child(2) { width: 270px; height: 270px; border-style: dotted; animation-duration: 36s; animation-direction: reverse; }
    span:nth-child(3) { width: 350px; height: 350px; border-width: 1px; border-style: solid; border-color: ${ring(0.12)}; }

    ${DESKTOP} {
        span:nth-child(1) { width: 260px; height: 260px; }
        span:nth-child(2) { width: 350px; height: 350px; }
        span:nth-child(3) { width: 450px; height: 450px; }
    }

    ${REDUCED} {
        span { animation: none; }
    }
`;

export const Art = styled.div`
    position: relative;
    flex: 1;
    display: grid;
    place-items: center;
    min-height: 0;
    padding: 6px 0;

    img {
        width: min(230px, 70%);
        height: auto;
        aspect-ratio: 1;
        object-fit: contain;
        filter: drop-shadow(0 14px 14px rgba(0, 0, 0, .35));
        animation: ${float} 4s ease-in-out infinite;
        user-select: none;
        -webkit-user-drag: none;
    }

    /* a altura do visor varia com a tela: a arte se limita ao espaço livre (cqh) */
    ${DESKTOP} {
        container-type: size;
        img { width: auto; height: min(340px, 100cqh - 12px); max-width: 78%; }
    }

    ${REDUCED} {
        img { animation: none; }
    }
`;

export const Burst = styled.div`
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    pointer-events: none;

    &::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(circle, #fff 0%, rgba(255, 255, 255, .6) 30%, transparent 65%);
        opacity: 0;
        animation: ${flash} .6s ease-out;
    }

    i {
        grid-area: 1 / 1;
        width: 16px;
        height: 16px;
        background: #ffe680;
        clip-path: polygon(50% 0, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0 50%, 38% 38%);
        opacity: 0;
        animation: ${sparkle} .9s cubic-bezier(.2, .8, .2, 1) var(--d) backwards;
    }

    ${Array.from({ length: 10 }, (_, i) => css`
        i:nth-child(${i + 1}) {
            --a: ${i * 36 + (i % 2) * 12}deg;
            --r: ${-(90 + (i % 3) * 30)}px;
            --d: ${(i % 4) * 50}ms;
            ${i % 2 ? "width: 10px; height: 10px; background: #fff;" : ""}
        }
    `)}

    ${REDUCED} {
        i { display: none; }
        &::before { animation-duration: .3s; }
    }
`;

export const Actions = styled.div`
    position: relative;
    z-index: 3;
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 0 14px 14px;
`;

export const ActionButton = styled.button<{ $active: boolean; $color: string }>`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 16px;
    border-radius: 999px;
    font-weight: 600;
    font-size: .9rem;
    color: ${({ $active, $color }) => ($active ? readableTextColor($color) : "#fff")};
    background: ${({ $active, $color, theme }) => ($active ? $color : glass(0.32)({ theme }))};
    box-shadow: inset 0 0 0 1.5px rgba(255, 255, 255, ${({ $active }) => ($active ? ".7" : ".25")});
    transition: transform .15s ease, background-color .25s ease, box-shadow .25s ease;

    &:active { transform: scale(.94); }
`;

export const Equalizer = styled.span<{ $playing: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: 2px;
    height: 16px;

    i {
        width: 3px;
        height: 100%;
        border-radius: 2px;
        background: currentColor;
        transform: scaleY(.25);
        ${({ $playing }) => $playing && css`animation: ${equalize} .5s ease-in-out infinite;`}
    }

    i:nth-child(2) { animation-delay: -.15s; }
    i:nth-child(3) { animation-delay: -.3s; }
    i:nth-child(4) { animation-delay: -.1s; }
    i:nth-child(5) { animation-delay: -.25s; }

    ${REDUCED} {
        i { animation: none; transform: scaleY(${({ $playing }) => ($playing ? 1 : 0.25)}); }
    }
`;

// ---- Painel de dados ----

export const Panel = styled.div<{ $stale: boolean }>`
    display: grid;
    gap: 14px;
    padding: 0 16px;
    min-width: 0;
    opacity: ${({ $stale }) => ($stale ? 0.55 : 1)};
    transition: opacity .2s ease;
    ${({ $stale }) => $stale && "pointer-events: none;"}

    ${DESKTOP} { padding: 0; }
`;

export const Header = styled.header`
    display: grid;
    gap: 6px;
    animation: ${enter} .4s cubic-bezier(.2, .8, .2, 1) backwards;

    .number {
        font-family: ${({ theme }) => theme.fontPixel};
        color: ${({ theme }) => theme.fontMuted};
    }

    h1 {
        font-size: clamp(1.7rem, 5vw, 2.3rem);
        line-height: 1.1;
        overflow-wrap: anywhere;
    }

    .genus { color: ${({ theme }) => theme.fontMuted}; }

    .badges {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 4px;
    }

    ${REDUCED} { animation: none; }
`;

export const TypeBadge = styled.span<{ $color: string; $text: string }>`
    font-size: .8rem;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 999px;
    color: ${({ $text }) => $text};
    background: ${({ $color }) => $color};
    ${({ $text }) => $text === "#ffffff" && "text-shadow: 0 1px 1px rgba(0, 0, 0, .35);"}
`;

export const Seal = styled.span<{ $mythical: boolean }>`
    font-size: .8rem;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 999px;
    color: #2a1d00;
    background: ${({ $mythical }) => ($mythical
        ? "linear-gradient(135deg, #f6c1ff, #a6e3ff)"
        : "linear-gradient(135deg, #ffe58a, #f7b733)")};
`;

export const Section = styled.section<{ $delay?: number; $stale?: boolean }>`
    display: grid;
    opacity: ${({ $stale }) => ($stale ? 0.55 : 1)};
    transition: opacity .2s ease;
    gap: 10px;
    padding: 14px;
    border-radius: 16px;
    background: ${({ theme }) => theme.card};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.screenLine};
    animation: ${enter} .45s cubic-bezier(.2, .8, .2, 1) backwards;
    animation-delay: ${({ $delay = 0 }) => `${$delay * 60}ms`};

    h2 {
        font-family: ${({ theme }) => theme.fontPixel};
        font-size: .85rem;
        font-weight: 500;
        letter-spacing: .04em;
        text-transform: uppercase;
        color: ${({ theme }) => theme.fontMuted};
    }

    ${REDUCED} { animation: none; }
`;

export const Flavor = styled.p`
    position: relative;
    font-family: ${({ theme }) => theme.fontPixel};
    font-size: 1rem;
    line-height: 1.55;

    .rest { visibility: hidden; }

    .caret {
        display: inline-block;
        width: .55em;
        height: 1em;
        margin: 0 1px -2px;
        background: currentColor;
        animation: ${blinkCaret} .8s steps(1) infinite;
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
    }
`;

export const Facts = styled.dl`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;

    div {
        display: grid;
        gap: 2px;
        padding: 10px;
        border-radius: 12px;
        background: ${({ theme }) => (theme.name === "light" ? theme.screen : theme.screenAlt)};
        text-align: center;
    }

    dt {
        font-size: .75rem;
        color: ${({ theme }) => theme.fontMuted};
    }

    dd {
        font-weight: 600;
        font-size: 1.05rem;
    }
`;

export const Abilities = styled.ul`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    list-style: none;

    li {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 999px;
        background: ${({ theme }) => (theme.name === "light" ? theme.screen : theme.screenAlt)};
        font-weight: 500;
    }

    small {
        font-size: .7rem;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 999px;
        color: ${({ theme }) => theme.fontMuted};
        box-shadow: inset 0 0 0 1px currentColor;
    }
`;

export const StatList = styled.div`
    display: grid;
    gap: 8px;
`;

export const StatRow = styled.div`
    display: grid;
    grid-template-columns: 86px 34px minmax(0, 1fr);
    align-items: center;
    gap: 8px;
    font-size: .85rem;

    .label { color: ${({ theme }) => theme.fontMuted}; }
    .value { font-weight: 600; text-align: right; font-variant-numeric: tabular-nums; }
`;

export const StatTrack = styled.div`
    height: 8px;
    border-radius: 999px;
    overflow: hidden;
    background: ${({ theme }) => theme.screenAlt};

    .fill {
        height: 100%;
        border-radius: inherit;
        transform-origin: left center;
    }
`;

export const StatTotal = styled.div`
    display: flex;
    justify-content: space-between;
    padding-top: 8px;
    margin-top: 2px;
    border-top: 1px solid ${({ theme }) => theme.screenLine};
    font-size: .9rem;
    color: ${({ theme }) => theme.fontMuted};

    strong {
        color: ${({ theme }) => theme.font};
        font-variant-numeric: tabular-nums;
    }
`;

export const EvolutionRow = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    overflow-x: auto;
    scrollbar-width: none;
    padding: 2px;
    &::-webkit-scrollbar { display: none; }

    .arrow {
        flex: none;
        color: ${({ theme }) => theme.fontMuted};
        animation: ${enter} .4s cubic-bezier(.2, .8, .2, 1) backwards;
    }

    ${REDUCED} { .arrow { animation: none; } }
`;


export const EvoButton = styled.button<{ $current: boolean; $order: number }>`
    display: grid;
    justify-items: center;
    gap: 4px;
    width: 100px;
    padding: 8px 6px 10px;
    border-radius: 14px;
    font-size: .8rem;
    font-weight: 600;
    background: ${({ $current, theme }) => ($current ? theme.cardHover : theme.screenAlt)};
    box-shadow: ${({ $current, theme }) => ($current ? `inset 0 0 0 2px ${theme.lens}` : "none")};
    transition: transform .15s ease;
    animation: ${enter} .45s cubic-bezier(.2, .8, .2, 1) backwards;
    animation-delay: ${({ $order }) => `${$order * 90}ms`};

    img {
        width: 72px;
        height: 72px;
        object-fit: contain;
        filter: drop-shadow(0 4px 4px rgba(0, 0, 0, .25));
    }

    span {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &:active { transform: scale(.94); }
    @media (hover: hover) { &:hover img { animation: ${hop} .45s cubic-bezier(.3, .7, .4, 1); } }

    @media (max-width: 859px) {
        width: 80px;
        padding: 6px 4px 8px;
        font-size: .75rem;
        img { width: 56px; height: 56px; }
    }

    ${REDUCED} {
        animation: none;
        &:hover img { animation: none; }
    }
`;

// muitas ramificações (ex.: Eevee) viram uma grade que quebra linha, em vez de uma coluna enorme
export const Stage = styled.div<{ $branched: boolean }>`
    flex: none;
    display: grid;
    gap: 6px;

    ${({ $branched }) => $branched && css`
        flex: 1 1 0;
        min-width: 72px;
        grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));

        ${DESKTOP} { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); }

        ${EvoButton} { width: auto; }
    `}
`;

export const Muted = styled.p`
    color: ${({ theme }) => theme.fontMuted};
    font-size: .9rem;
`;

export const SkeletonLine = styled.div<{ $width?: string; $height?: number }>`
    width: ${({ $width = "100%" }) => $width};
    height: ${({ $height = 16 }) => $height}px;
    border-radius: 10px;
    background: linear-gradient(90deg, ${({ theme }) => theme.card} 0%, ${({ theme }) => theme.cardHover} 50%, ${({ theme }) => theme.card} 100%);
    background-size: 200% 100%;
    animation: ${shimmer} 1.3s linear infinite;

    ${REDUCED} { animation: none; }
`;

export const Status = styled.div`
    display: grid;
    place-items: center;
    align-content: center;
    gap: 14px;
    padding: 40px 20px;
    text-align: center;
    color: ${({ theme }) => theme.fontMuted};
    font-family: ${({ theme }) => theme.fontPixel};

    button {
        padding: 8px 16px;
        border-radius: 999px;
        box-shadow: inset 0 0 0 1.5px currentColor;
    }
`;

export const Pokeball = styled.div`
    width: 56px;
    aspect-ratio: 1;
    border-radius: 50%;
    background:
        radial-gradient(circle, #fff 0 6px, #222 7px 11px, transparent 12px),
        linear-gradient(#e3102a 0 46%, #222 46% 54%, #f4f4f4 54%);
    box-shadow: 0 0 0 3px #222;
    animation: ${spin} 1s cubic-bezier(.5, .1, .5, .9) infinite;
`;
