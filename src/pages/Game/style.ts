import styled from "styled-components";
export const Container = styled.div`
    min-height: 100%; position: relative; padding: 10px clamp(8px, 2%, 18px) 14px;
    display: grid; grid-template-columns: minmax(0, 1fr); align-content: center; gap: 8px;
    color: ${({ theme }) => theme.font};
    > * { max-width: 100%; min-width: 0; }
    .tv-column, .play-column { min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 8px; }
    header { text-align: center; }
    .eyebrow { color: ${({ theme }) => theme.fontMuted}; font: 12px ${({ theme }) => theme.fontPixel}; letter-spacing: .15em; }
    h1 { font: 600 clamp(16px, 2.3vw, 22px) ${({ theme }) => theme.fontPixel}; margin: 0; }
    p { margin: 0; line-height: 1.5; }
    header p, small { font-size: 12px; color: ${({ theme }) => theme.fontMuted}; text-align: center; }
    button { cursor: pointer; min-height: 40px; border-radius: 8px; padding: 6px 10px; background: ${({ theme }) => theme.screenAlt}; color: ${({ theme }) => theme.font}; font: inherit; border: 1px solid ${({ theme }) => theme.screenLine}; }
    button:disabled { cursor: default; opacity: .45; }
    button:focus-visible, input:focus-visible { outline: 2px solid ${({ theme }) => theme.lens}; outline-offset: 3px; }
    .score { display: flex; justify-content: center; flex-wrap: wrap; gap: 5px; font-size: 11px; }
    .score > span { background: ${({ theme }) => theme.screenAlt}; padding: 5px 8px; border-radius: 8px; }
    .score b { margin-left: 5px; color: ${({ theme }) => theme.lens}; }
    .score abbr { display: none; }
    .colors { display: flex; justify-content: center; gap: 4px; }
    .colors button { width: 36px; min-height: 32px; padding: 5px; background: transparent; border: 2px solid transparent; }
    .colors button[aria-pressed=true] { border-color: ${({ theme }) => theme.font}; }
    .colors i { display: block; width: 20px; aspect-ratio: 1; border-radius: 50%; box-shadow: inset 0 -3px 0 #0003; }
    .lives { display: flex; gap: 9px; }
    .ball { width: 20px; aspect-ratio: 1; border-radius: 50%; border: 2px solid #272b39; background: radial-gradient(circle, white 0 2px, #272b39 2px 4px, transparent 4px), linear-gradient(#ef4855 0 44%, #272b39 44% 56%, #f5f5ed 56%); }
    .ball.lost { opacity: .2; filter: grayscale(1); }
    .ball { transition: opacity .35s, transform .35s, filter .35s; }
    .ball.lost { transform: scale(.65); }
    .tv-tools { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .tv-tools > button, .mode-tools button { min-height: 30px; font-size: 11px; padding: 4px 8px; }
    .mode-tools { display: flex; align-items: center; justify-content: space-between; width: 100%; font-size: 11px; color: ${({ theme }) => theme.fontMuted}; }
    .hint-log { width: 100%; background: #081c20; color: #b4e7cf; padding: 10px; border: 1px solid #27504c; border-radius: 10px; font: 12px ${({ theme }) => theme.fontPixel}; }
    .hint-log h2 { font-size: 12px; margin-bottom: 6px; color: #67d7af; }
    .log-lines { max-height: 120px; overflow-y: auto; overscroll-behavior: contain; }
    .log-lines p + p { margin-top: 6px; }
    .log-lines b { color: #67d7af; }
    .log-empty { opacity: .6; }
    .power-warning { width: 100%; padding: 8px; border: 1px solid #e9b45a; border-radius: 10px; font-size: 12px; }
    .power-warning button { min-height: 32px; font-size: 11px; margin: 6px 5px 0 0; }
    .mode-picker { grid-column: 1 / -1; width: 100%; display: grid; gap: 18px; justify-items: center; padding: 20px 0; }
    .mode-cards { width: 100%; display: grid; gap: 12px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .mode-cards button { min-height: 160px; display: flex; flex-direction: column; align-items: start; text-align: left; gap: 14px; padding: 20px; }
    .mode-cards strong { font: 26px ${({ theme }) => theme.fontPixel}; }
    .mode-cards span { font-size: 13px; line-height: 1.6; color: ${({ theme }) => theme.fontMuted}; }
    .mode-cards .selected { box-shadow: inset 0 0 0 2px ${({ theme }) => theme.lens}; }
    .result { text-align: center; min-height: 20px; font-weight: 600; font-size: 12px; }
    .slots { display: flex; flex-wrap: wrap; justify-content: center; gap: 5px; perspective: 600px; }
    .slot { width: clamp(18px, 4vw, 28px); height: 32px; display: grid; place-items: center; border-radius: 5px; background: ${({ theme }) => theme.screenAlt}; border-bottom: 2px solid ${({ theme }) => theme.lens}; font: 20px ${({ theme }) => theme.fontPixel}; }
    .slot.open span { animation: letter-flip .45s ease; }
    .actions { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
    .actions button { font-size: 13px; }
    .primary { background: ${({ theme }) => theme.lens}; color: #07172b; font-weight: 600; }
    .hint { font-size: 13px; color: ${({ theme }) => theme.fontMuted}; text-align: center; }
    .keyboard { width: min(100%, 480px); display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 5px; }
    .keyboard button { padding: 4px; font-weight: 600; transition: transform .15s; }
    .keyboard button:active { transform: scale(.92); }
    .keyboard .selected { box-shadow: inset 0 0 0 2px ${({ theme }) => theme.lens}; }
    .keyboard .correct { background: #19684c; color: #d9ffec; opacity: 1; }
    .keyboard .wrong { background: #9c2941; color: #fff; opacity: .75; animation: wrong-key .35s; }
    form { width: min(100%, 480px); }
    label { display: block; font-size: 12px; margin-bottom: 6px; }
    .answer { display: flex; gap: 6px; }
    input { min-width: 0; width: 100%; border: 1px solid ${({ theme }) => theme.screenLine}; background: ${({ theme }) => theme.screenAlt}; color: ${({ theme }) => theme.font}; border-radius: 10px; padding: 10px; font-size: 16px; }
    .answer button { font-size: 12px; }
    small { line-height: 1.7; }
    .confetti { position: absolute; top: 20%; left: 0; right: 0; height: 200px; pointer-events: none; overflow: hidden; }
    .confetti i { position: absolute; width: 6px; height: 10px; opacity: 0; animation: confetti-fall 1.8s ease-out forwards; }
    @keyframes confetti-fall { 0% { opacity: 1; transform: translateY(-30px) rotate(0); } 100% { opacity: 0; transform: translateY(220px) rotate(240deg); } }
    @keyframes letter-flip { from { transform: rotateX(90deg); opacity: 0; } to { transform: rotateX(0); opacity: 1; } }
    @keyframes wrong-key { 25%,75% { transform: translateX(-3px); } 50% { transform: translateX(3px); } }
    @media (max-width: 859px) {
        padding: 6px 8px 10px; gap: 5px;
        grid-template-columns: minmax(0, 1fr) auto; align-content: start;
        header { grid-row: 1; grid-column: 1; text-align: left; align-self: center; }
        h1 { font-size: clamp(11px, 3.2vw, 15px); }
        > :not(header), .play-column > * { grid-column: 1 / -1; }
        .play-column { display: contents; }
        .play-column > .score { grid-row: 1; grid-column: 2; }
        .score { gap: 3px; flex-wrap: nowrap; font-size: 10px; }
        .score > span { padding: 4px; white-space: nowrap; }
        .score .score-label { display: none; }
        .score abbr { display: inline; text-decoration: none; }
        .score b { margin-left: 1px; }
        .tv-column { display: contents; }
        .tv-column > * { grid-column: 1 / -1; }
        .tv-column > :first-child { grid-row: 2; }
        .tv-tools { grid-row: 3; }
        .mode-tools { grid-row: 13; }
        .hint-log { grid-row: 10; padding: 7px; }
        .hint-log:has(.log-empty):not(:has(button)) { display: none; }
        .mode-cards { grid-template-columns: minmax(0, 1fr); gap: 8px; }
        .mode-cards button { min-height: 100px; padding: 14px; gap: 7px; }
        .colors { justify-content: start; gap: 0; }
        .colors button { width: 26px; min-height: 30px; padding: 3px; }
        .colors i { width: 16px; }
        .lives { gap: 4px; }
        .ball { width: 13px; }
        .result { min-height: 16px; font-size: 11px; }
        .slots { gap: 4px; }
        .slot { height: 28px; font-size: 18px; }
        .actions { gap: 6px; }
        .actions button { min-height: 34px; padding: 4px 8px; font-size: 12px; }
        .keyboard, form { justify-self: center; }
        small { text-align: center; font-size: 10px; }
    }
    @media (min-width: 860px) {
        grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 10px 20px;
        header { grid-column: 1 / -1; }
        .tv-column { justify-content: center; }
        .play-column { gap: 9px; }
    }
    @media (prefers-reduced-motion: reduce) { &, * { animation: none !important; transition: none !important; } }
`;
