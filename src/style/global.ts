import { createGlobalStyle } from "styled-components";

export const Global = createGlobalStyle`
    *, *::before, *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    :root {
        font-size: 16px;
        font-family: ${({ theme }) => theme.fontUi};
        color-scheme: ${({ theme }) => theme.name};
        -webkit-tap-highlight-color: transparent;
    }

    html, body, #root {
        height: 100%;
    }

    body {
        background:
            radial-gradient(1200px 700px at 50% -10%, ${({ theme }) => theme.backgroundGlow}, transparent 70%),
            ${({ theme }) => theme.background};
        color: ${({ theme }) => theme.font};
        -webkit-font-smoothing: antialiased;
        overflow: hidden;
        overscroll-behavior: none;
        transition: background-color 0.4s ease, color 0.4s ease;
    }

    button {
        font: inherit;
        color: inherit;
        background: none;
        border: none;
        cursor: pointer;
        touch-action: manipulation;
    }

    input {
        font: inherit;
        color: inherit;
    }

    img {
        display: block;
        max-width: 100%;
    }

    :focus-visible {
        outline: 3px solid ${({ theme }) => theme.lens};
        outline-offset: 2px;
    }

    /* Transição entre telas (View Transitions API): efeito de troca de canal na tela */
    ::view-transition-old(screen) {
        animation: screen-out 220ms cubic-bezier(.4, 0, 1, 1) both;
    }
    ::view-transition-new(screen) {
        animation: screen-in 320ms cubic-bezier(0, 0, .2, 1) 60ms both;
    }
    ::view-transition-group(*) {
        animation-duration: 420ms;
        animation-timing-function: cubic-bezier(.2, .8, .2, 1);
    }

    @keyframes screen-out {
        to { opacity: 0; transform: scale(.985); filter: brightness(1.6) blur(2px); }
    }
    @keyframes screen-in {
        from { opacity: 0; transform: scale(1.015); filter: brightness(1.8) blur(3px); }
    }

    @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
            animation-duration: 1ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 1ms !important;
        }
        ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) {
            animation: none !important;
        }
    }
`;
