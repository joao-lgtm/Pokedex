import styled, { css, keyframes } from "styled-components";

const MOBILE = "@media (max-width: 720px)";
const NARROW = "@media (max-width: 380px)";

const lidOpen = keyframes`
    0%   { transform: perspective(1800px) rotateY(0deg); }
    18%  { transform: perspective(1800px) rotateY(-6deg); }
    100% { transform: perspective(1800px) rotateY(-112deg); visibility: hidden; }
`;

const lidSlide = keyframes`
    0%   { transform: translateY(0); }
    20%  { transform: translateY(2%); }
    100% { transform: translateY(-104%); visibility: hidden; }
`;

const crtOn = keyframes`
    0%   { transform: scale(0.02, 0.004); filter: brightness(6); opacity: 0; }
    35%  { transform: scale(1, 0.006);    filter: brightness(5); opacity: 1; }
    60%  { transform: scale(1, 1);        filter: brightness(2.2); }
    100% { transform: scale(1, 1);        filter: brightness(1); }
`;

const ledBoot = keyframes`
    0%, 100% { opacity: .35; }
    50% { opacity: 1; filter: brightness(1.6); }
`;

const lensBlink = keyframes`
    0%, 100% { filter: brightness(1); }
    25%, 75% { filter: brightness(1.9) saturate(1.3); }
    50% { filter: brightness(1.1); }
`;

const shake = keyframes`
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-4px); }
    40% { transform: translateX(4px); }
    60% { transform: translateX(-3px); }
    80% { transform: translateX(2px); }
`;

export const Page = styled.div`
    height: 100%;
    display: grid;
    place-items: center;
    padding: clamp(8px, 2.2vw, 28px);

    ${MOBILE} {
        padding: 0;
    }
`;

export const Shell = styled.div<{ $rotom: boolean; $color: string }>`
    --shell: ${({ $color }) => $color};
    position: relative;
    width: min(1180px, 100%);
    height: 100%;
    max-height: 940px;
    display: flex;
    flex-direction: column;
    border-radius: ${({ $rotom }) => ($rotom ? "38px 38px 30px 30px" : "22px 22px 22px 44px")};
    /* cor sólida + camadas translúcidas: a troca Pokédex <-> Rotom transiciona a cor */
    background-color: var(--shell);
    background-image:
        radial-gradient(120% 80% at 10% 0%, rgba(255, 255, 255, .28) 0%, transparent 42%),
        linear-gradient(160deg, transparent 40%, rgba(0, 0, 0, .32) 100%);
    transition: background-color .6s ease, border-radius .6s cubic-bezier(.2, .8, .2, 1);
    box-shadow:
        inset 0 2px 0 rgba(255, 255, 255, .35),
        inset 0 -6px 0 rgba(0, 0, 0, .25),
        0 30px 80px -20px rgba(0, 0, 0, .55),
        0 0 0 1px rgba(0, 0, 0, .35);
    isolation: isolate;

    ${MOBILE} {
        max-height: none;
        border-radius: 0;
        padding-top: env(safe-area-inset-top);
    }
`;

export const TopBar = styled.header`
    position: relative;
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 18px 24px 26px;
    min-height: 112px;

    ${MOBILE} {
        gap: 12px;
        min-height: 76px;
        padding: 10px 14px 16px;
    }

    ${NARROW} { gap: 8px; }
`;

export const TopEdge = styled.svg`
    position: absolute;
    inset: auto 0 0 0;
    width: 100%;
    height: 34px;
    pointer-events: none;
    transition: opacity .4s ease;

    ${MOBILE} {
        height: 22px;
    }
`;

export const Lens = styled.div<{ $hidden?: boolean }>`
    --lens-level: 0;
    position: relative;
    flex: none;
    transition: opacity .35s ease, transform .5s cubic-bezier(.3, 1.4, .5, 1);
    ${({ $hidden }) => $hidden && css`opacity: 0; transform: scale(.4) rotate(-40deg); pointer-events: none;`}
    width: 78px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #f4f4f4;
    box-shadow: 0 0 0 3px #1b1b1b, 0 6px 14px rgba(0, 0, 0, .35);

    &::before {
        content: "";
        position: absolute;
        inset: 8px;
        border-radius: 50%;
        background:
            radial-gradient(circle at 32% 28%, #ffffff 0 9%, transparent 10%),
            radial-gradient(circle at 50% 55%, ${({ theme }) => theme.lens} 0%, ${({ theme }) => theme.lensDeep} 78%);
        box-shadow: inset 0 0 0 2px #0c2c6b, inset 0 -8px 16px rgba(0, 0, 0, .35);
        transform: scale(calc(1 + var(--lens-level) * .06));
        filter: brightness(calc(1 + var(--lens-level) * 1.1));
        will-change: transform, filter;
    }

    /* halo de luz: só opacity/transform para ficar leve no celular */
    &::after {
        content: "";
        position: absolute;
        inset: -14px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(80, 190, 255, .75) 0%, transparent 65%);
        opacity: calc(.12 + var(--lens-level) * .88);
        transform: scale(calc(.9 + var(--lens-level) * .35));
        pointer-events: none;
        z-index: -1;
    }

    &[data-blink="busy"]::before { animation: ${lensBlink} .9s ease-in-out infinite; }
    &[data-blink="success"]::before { animation: ${lensBlink} .5s ease-in-out 2; }
    &[data-blink="error"] { animation: ${shake} .4s ease-in-out; }

    ${MOBILE} {
        width: 52px;
        &::before { inset: 5px; }
    }
`;

export const Leds = styled.div<{ $boot: boolean; $hidden?: boolean }>`
    display: flex;
    transition: opacity .3s ease, transform .4s ease;
    ${({ $hidden }) => $hidden && css`opacity: 0; transform: translateY(-12px);`}
    gap: 10px;
    align-self: flex-start;
    padding-top: 6px;

    /* em 360 px o botão de customizar não cabe junto: os LEDs são só decoração */
    ${NARROW} { display: none; }

    span {
        width: 16px;
        aspect-ratio: 1;
        border-radius: 50%;
        box-shadow: 0 0 0 2px #1b1b1b, inset 0 -3px 4px rgba(0, 0, 0, .3), inset 0 2px 2px rgba(255, 255, 255, .55);
    }
    span:nth-child(1) { background: #ff3048; }
    span:nth-child(2) { background: #ffd23f; }
    span:nth-child(3) { background: #44d36b; }

    ${({ $boot }) => $boot && css`
        span { animation: ${ledBoot} .36s ease-in-out 4; }
        span:nth-child(2) { animation-delay: .12s; }
        span:nth-child(3) { animation-delay: .24s; }
    `}

    ${MOBILE} {
        gap: 7px;
        padding-top: 2px;
        span { width: 11px; }
    }
`;

export const Nav = styled.nav`
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 8px;
    align-self: flex-start;

    ${NARROW} { gap: 6px; }
`;

export const NavButton = styled.button<{ $active: boolean }>`
    position: relative;
    font-family: ${({ theme }) => theme.fontPixel};
    font-size: .95rem;
    letter-spacing: .04em;
    color: #fff;
    padding: 8px 14px;
    border-radius: 999px;
    background: rgba(0, 0, 0, ${({ $active }) => ($active ? ".38" : ".14")});
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, ${({ $active }) => ($active ? ".35" : ".12")});
    transition: background .2s ease, transform .15s ease;

    &:active { transform: scale(.95); }

    ${MOBILE} {
        font-size: .8rem;
        padding: 7px 11px;
    }

    ${NARROW} { padding: 7px 9px; }
`;

export const ThemeToggle = styled.button`
    width: 38px;
    aspect-ratio: 1;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: rgba(0, 0, 0, .18);
    color: #fff;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .15);
    transition: transform .3s cubic-bezier(.3, 1.6, .5, 1);

    &:active { transform: rotate(40deg) scale(.9); }

    ${MOBILE} { width: 34px; }
`;

export const Body = styled.div`
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 8px 28px 0;

    ${MOBILE} {
        padding: 4px 10px 0;
    }
`;

export const Bezel = styled.div`
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 22px 26px 34px;
    border-radius: 14px 14px 14px 56px;
    background: linear-gradient(180deg, #f3efe9, ${({ theme }) => theme.bezel});
    box-shadow: inset 0 -4px 0 rgba(0, 0, 0, .12), 0 0 0 2px rgba(0, 0, 0, .45);

    /* dois pontinhos vermelhos acima da tela, como na Pokédex de Kanto */
    &::before {
        content: "";
        position: absolute;
        top: 8px;
        left: 50%;
        width: 34px;
        height: 8px;
        transform: translateX(-50%);
        background:
            radial-gradient(circle at 4px 4px, #e3102a 3.5px, transparent 4px),
            radial-gradient(circle at 30px 4px, #e3102a 3.5px, transparent 4px);
    }

    ${MOBILE} {
        padding: 16px 8px 22px;
        border-radius: 12px 12px 12px 30px;
        &::before { top: 5px; }
    }
`;

export const ScreenFrame = styled.div<{ $boot: boolean }>`
    position: relative;
    flex: 1;
    min-height: 0;
    border-radius: 8px;
    overflow: hidden;
    background: ${({ theme }) => theme.screen};
    box-shadow: inset 0 0 0 2px #1d1d1d, inset 0 0 40px rgba(0, 0, 0, .35);
    transition: background-color .4s ease;
    transform-origin: center;

    ${({ $boot }) => $boot && css`
        animation: ${crtOn} .75s cubic-bezier(.2, .8, .2, 1) .9s both;
    `}

    ${MOBILE} {
        ${({ $boot }) => $boot && css`animation-delay: .7s;`}
    }
`;

export const Screen = styled.div`
    position: absolute;
    inset: 0;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scrollbar-color: rgba(127, 127, 127, .4) transparent;
    view-transition-name: screen;
    -webkit-overflow-scrolling: touch;
`;

export const Scanlines = styled.div`
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: inherit;
    background:
        repeating-linear-gradient(0deg, ${({ theme }) => theme.screenLine} 0 1px, transparent 1px 3px),
        radial-gradient(120% 90% at 50% 50%, transparent 60%, rgba(0, 0, 0, .28) 100%);
    z-index: 2;
`;

export const BezelFooter = styled.div`
    position: absolute;
    left: 26px;
    right: 26px;
    bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    pointer-events: none;

    .power {
        width: 14px;
        aspect-ratio: 1;
        border-radius: 50%;
        background: #e3102a;
        box-shadow: 0 0 0 2px #1b1b1b;
    }

    .visitors {
        font-family: ${({ theme }) => theme.fontPixel};
        font-size: 11px;
        letter-spacing: .12em;
        color: #5a5650;
        font-variant-numeric: tabular-nums;
    }

    .speaker {
        display: grid;
        gap: 3px;
        span {
            display: block;
            width: 34px;
            height: 3px;
            border-radius: 2px;
            background: #2a2a2a;
        }
    }

    ${MOBILE} {
        left: 18px;
        right: 18px;
        bottom: 5px;
        .power { width: 10px; }
        .visitors { font-size: 9px; }
        .speaker span { width: 22px; height: 2px; }
    }
`;

export const Controls = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 34px 22px;

    ${MOBILE} {
        padding: 10px 18px calc(12px + env(safe-area-inset-bottom));
    }
`;

export const RoundButton = styled.button<{ $color: string }>`
    width: 52px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: ${({ $color }) => $color};
    color: rgba(0, 0, 0, .55);
    font-family: ${({ theme }) => theme.fontPixel};
    font-weight: 700;
    box-shadow: 0 0 0 2px #1b1b1b, inset 0 -5px 0 rgba(0, 0, 0, .28), inset 0 3px 2px rgba(255, 255, 255, .45);
    transition: transform .08s ease, box-shadow .08s ease;

    &:active {
        transform: translateY(2px);
        box-shadow: 0 0 0 2px #1b1b1b, inset 0 -2px 0 rgba(0, 0, 0, .28), inset 0 3px 2px rgba(255, 255, 255, .45);
    }

    ${MOBILE} { width: 42px; }
`;

export const PillGroup = styled.div`
    display: flex;
    gap: 14px;

    button {
        width: 54px;
        height: 12px;
        border-radius: 999px;
        background: #2b2b2b;
        box-shadow: inset 0 -2px 0 rgba(0, 0, 0, .5), 0 1px 0 rgba(255, 255, 255, .25);
        transition: transform .08s ease;
        &:active { transform: translateY(1px) scale(.97); }
    }

    ${MOBILE} {
        gap: 8px;
        button { width: 38px; height: 10px; }
    }
`;

export const DPad = styled.div`
    position: relative;
    width: 108px;
    aspect-ratio: 1;
    flex: none;

    button {
        position: absolute;
        width: 36px;
        height: 36px;
        background: #232323;
        color: #777;
        display: grid;
        place-items: center;
        box-shadow: inset 0 -3px 0 rgba(0, 0, 0, .6);
        transition: background .08s ease;
        &:active { background: #111; }
    }
    .up    { left: 36px; top: 0; border-radius: 6px 6px 0 0; }
    .down  { left: 36px; bottom: 0; border-radius: 0 0 6px 6px; }
    .left  { top: 36px; left: 0; border-radius: 6px 0 0 6px; }
    .right { top: 36px; right: 0; border-radius: 0 6px 6px 0; }

    &::after {
        content: "";
        position: absolute;
        left: 36px;
        top: 36px;
        width: 36px;
        height: 36px;
        background: radial-gradient(circle, #1a1a1a 0 8px, #232323 9px);
        pointer-events: none;
    }

    ${MOBILE} {
        width: 84px;
        button { width: 28px; height: 28px; }
        .up, .down { left: 28px; }
        .left, .right { top: 28px; }
        &::after { left: 28px; top: 28px; width: 28px; height: 28px; }
    }
`;

export const Lid = styled.div<{ $boot: boolean }>`
    position: absolute;
    inset: 0;
    z-index: 20;
    border-radius: inherit;
    transform-origin: left center;
    backface-visibility: hidden;
    pointer-events: none;
    visibility: ${({ $boot }) => ($boot ? "visible" : "hidden")};
    background-color: var(--shell);
    background-image:
        radial-gradient(90% 60% at 20% 10%, rgba(255, 255, 255, .3) 0%, transparent 50%),
        linear-gradient(170deg, transparent 30%, rgba(0, 0, 0, .35));
    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, .35), inset 0 3px 0 rgba(255, 255, 255, .3);
    display: grid;
    place-items: center;

    ${({ $boot }) => $boot && css`
        animation: ${lidOpen} 1.1s cubic-bezier(.6, 0, .25, 1) .15s forwards;
        ${MOBILE} { animation-name: ${lidSlide}; animation-duration: .9s; }
    `}

    /* recorte em "degrau" do topo da tampa */
    &::before {
        content: "";
        position: absolute;
        top: 32%;
        left: 8%;
        right: 8%;
        height: 4px;
        border-radius: 2px;
        background: rgba(0, 0, 0, .28);
    }

    &::after {
        content: "";
        width: min(38%, 260px);
        aspect-ratio: 2.6;
        clip-path: polygon(0 0, 100% 0, 100% 60%, 80% 100%, 0 100%);
        background: #ffd23f;
        box-shadow: inset 0 -6px 0 rgba(0, 0, 0, .2);
        opacity: .9;
    }
`;

const eyeBlink = keyframes`
    0%, 92%, 100% { transform: scaleY(1); }
    95% { transform: scaleY(.08); }
`;

const eyeIn = keyframes`
    from { transform: translateY(14px) scale(.3); opacity: 0; }
`;

/** Olhos da Rotom no topo do chassi: seguem o ponteiro por --eye-x / --eye-y (-1..1). */
export const RotomEyes = styled.div<{ $mood: "idle" | "happy" | "wrong" }>`
    --eye-x: 0;
    --eye-y: 0;
    position: absolute;
    left: 50%;
    top: 50%;
    display: flex;
    align-items: center;
    gap: 34px;
    transform: translate(-50%, -58%);
    pointer-events: none;
    animation: ${eyeIn} .55s cubic-bezier(.3, 1.5, .5, 1) .15s backwards;
    ${({ $mood }) => $mood === "wrong" && css`
        > * { animation: ${shake} .45s ease-in-out; }
    `}

    .dot {
        width: 14px;
        aspect-ratio: 1;
        border-radius: 50%;
        background: #1b1b1b;
        box-shadow: inset 0 2px 2px rgba(255, 255, 255, .25);
    }

    .eye {
        position: relative;
        width: 58px;
        height: 66px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 0 0 3px #1b1b1b, inset 0 -6px 0 rgba(0, 0, 0, .08);
        overflow: hidden;
        animation: ${eyeBlink} 4.2s ease-in-out infinite;
        transition: border-radius .3s ease, height .3s ease;
    }
    .eye + .dot + .eye { animation-delay: .04s; }

    .iris {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 32px;
        height: 42px;
        margin: -21px 0 0 -16px;
        border-radius: 50%;
        background: radial-gradient(circle at 50% 40%, #6fd0ff 0%, #2a8fe0 70%);
        box-shadow: inset 0 0 0 3px #1665b5;
        transform: translate(calc(var(--eye-x) * 11px), calc(var(--eye-y) * 10px));
        transition: transform .12s linear;
    }
    .iris::before {
        content: "";
        position: absolute;
        left: 50%;
        top: 22%;
        width: 9px;
        height: 18px;
        margin-left: -4.5px;
        border-radius: 50%;
        background: #0d2f55;
    }
    .iris::after {
        content: "";
        position: absolute;
        left: 20%;
        top: 12%;
        width: 8px;
        aspect-ratio: 1;
        border-radius: 50%;
        background: #fff;
    }

    /* feliz: olhos viram arcos ^ ^ */
    ${({ $mood }) => $mood === "happy" && css`
        .eye {
            height: 30px;
            border-radius: 30px 30px 6px 6px;
            animation: none;
        }
        .iris { transform: translateY(6px) scale(.9); }
    `}

    @media (max-width: 720px) {
        left: 12px;
        gap: 16px;
        transform-origin: left center;
        transform: translateY(-58%) scale(.6);
    }
`;

/** Barbatanas azuis da Rotom nas laterais do chassi. */
export const Fin = styled.div<{ $side: "left" | "right"; $show: boolean }>`
    position: absolute;
    top: 16%;
    ${({ $side }) => $side}: -34px;
    width: 34px;
    height: 46%;
    background: linear-gradient(180deg, #7fd9ff, #2f9fe8);
    clip-path: ${({ $side }) => ($side === "left"
        ? "polygon(100% 0, 0 18%, 30% 50%, 0 82%, 100% 100%)"
        : "polygon(0 0, 100% 18%, 70% 50%, 100% 82%, 0 100%)")};
    filter: drop-shadow(0 0 0 #1b1b1b);
    z-index: -1;
    transform-origin: ${({ $side }) => ($side === "left" ? "right" : "left")} center;
    transform: scaleX(${({ $show }) => ($show ? 1 : 0)});
    opacity: ${({ $show }) => ($show ? 1 : 0)};
    transition: transform .55s cubic-bezier(.3, 1.5, .5, 1) .1s, opacity .3s ease;

    @media (max-width: 1240px) {
        ${({ $side }) => $side}: -20px;
        width: 20px;
    }
    @media (max-width: 720px) {
        display: none;
    }
`;

const cursorPulse = keyframes`
    0%, 100% { box-shadow: 0 0 0 2px #fff, 0 0 0 5px var(--cursor), 0 0 18px 4px var(--cursor); }
    50% { box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--cursor), 0 0 26px 8px var(--cursor); }
`;

/** Anel do cursor do D-pad: desliza entre itens só com transform/width/height. */
export const Cursor = styled.div`
    --cursor: ${({ theme }) => theme.lens};
    position: absolute;
    left: 0;
    top: 0;
    z-index: 4;
    width: 0;
    height: 0;
    border-radius: 14px;
    pointer-events: none;
    opacity: 0;
    transition:
        transform .2s cubic-bezier(.2, .9, .25, 1.15),
        width .2s cubic-bezier(.2, .9, .25, 1.15),
        height .2s cubic-bezier(.2, .9, .25, 1.15),
        opacity .15s ease;
    animation: ${cursorPulse} 1.2s ease-in-out infinite;

    &[data-visible="true"] { opacity: 1; }

    /* setinha pixelada apontando para o item */
    &::before {
        content: "";
        position: absolute;
        left: -14px;
        top: 50%;
        width: 10px;
        height: 12px;
        margin-top: -6px;
        background: #fff;
        clip-path: polygon(0 0, 100% 50%, 0 100%);
        filter: drop-shadow(0 0 3px var(--cursor));
        animation: ${keyframes`50% { transform: translateX(3px); }`} .6s steps(2) infinite;
    }
`;

/** Painel de cor + adesivos, posicionado dentro da tela rolável (#screen). */
export const CustomizePanel = styled.aside`
    position: absolute;
    z-index: 20;
    right: 0;
    width: min(360px, 100%);
    overflow-y: auto;
    padding: 16px;
    border: 1px solid ${({ theme }) => theme.lens};
    border-radius: 16px 0 0 16px;
    background: ${({ theme }) => theme.screen};
    color: ${({ theme }) => theme.font};
    box-shadow: -10px 10px 40px #0006;
    display: flex;
    flex-direction: column;
    gap: 12px;

    button {
        cursor: pointer;
        min-height: 40px;
        border-radius: 8px;
        padding: 6px 10px;
        background: ${({ theme }) => theme.screenAlt};
        color: ${({ theme }) => theme.font};
        font: inherit;
        border: 1px solid ${({ theme }) => theme.screenLine};
    }
    button:disabled { cursor: default; opacity: .45; }
    button:focus-visible { outline: 2px solid ${({ theme }) => theme.lens}; outline-offset: 3px; }
    p { margin: 0; font-size: 12px; color: ${({ theme }) => theme.fontMuted}; }
    h3 { margin: 0; font-size: 13px; }

    .panel-heading { display: flex; justify-content: space-between; align-items: center; }
    .panel-heading h2 { margin: 0; font: 24px ${({ theme }) => theme.fontPixel}; }
    .custom-colors { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 5px; }
    .custom-colors button { display: flex; flex-direction: column; align-items: center; gap: 5px; font-size: 10px; padding: 6px 2px; }
    .custom-colors i { width: 24px; height: 24px; border-radius: 50%; border: 1px solid #ffffff60; }
    .custom-colors button[aria-pressed=true] { outline: 2px solid ${({ theme }) => theme.lens}; outline-offset: -2px; }
    .sticker-catalog { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
    .sticker-catalog button { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 8px 4px; font-size: 10px; }

    @media (max-width: 859px) {
        border-radius: 16px 16px 0 0;
        width: 100%;
    }
`;
