import styled from "styled-components";
export const Container = styled.div`
    width: 100%; position: relative; padding: 5px; border-radius: 16px;
    background: #282d3a; box-shadow: inset 0 2px 4px #0008;
    .glass { width: 100%; height: min(38vh, 260px); background: #101722; border-radius: 12px; overflow: hidden; }
    .broadcast { width: 100%; height: 100%; position: relative; display: grid; place-items: center; background: radial-gradient(ellipse, #e9fcda, #87c8bf); transition: transform .5s ease, opacity .45s; }
    .broadcast.off { transform: scaleY(.006) scaleX(.2); opacity: 0; }
    .broadcast.on { transform: scale(1); opacity: 1; }
    .broadcast::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(transparent 0 3px, #17383a17 3px 4px); }
    .channel { position: absolute; left: 5%; top: 6%; font: 10px monospace; color: #245657; }
    img { position: absolute; left: 10%; top: 8%; width: 80%; height: 84%; object-fit: contain; object-position: center; transition: filter .65s ease; user-select: none; }
    .silhouette { filter: brightness(0); }
    .revealed { filter: brightness(1); }
    .flash { position: absolute; inset: 0; background: white; animation: rotom-flash .65s forwards; pointer-events: none; }
    button.power { position: absolute; right: 12px; bottom: 12px; width: 40px; min-height: 40px; padding: 0; font-size: 25px; background: #263744; color: #ceffee; border-radius: 50%; border: 1px solid #ffffff50; }
    @media (max-width: 859px) { .glass { height: clamp(150px, 30dvh, 260px); } }
    @media (min-width: 860px) { .glass { height: clamp(210px, 35vh, 360px); } }
    @keyframes rotom-flash { from { opacity: 1; } to { opacity: 0; } }
    @media (prefers-reduced-motion: reduce) { &, * { animation: none !important; transition: none !important; } .flash { opacity: 0; } }
`;
