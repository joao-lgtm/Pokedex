import styled, { keyframes } from "styled-components";
import { readableTextColor } from "../../style/types";

const shimmer = keyframes`
    to { background-position: -200% 0; }
`;

const spin = keyframes`
    to { transform: rotate(360deg); }
`;

export const Container = styled.div`
    min-height: 100%;
    display: flex;
    flex-direction: column;
`;

export const Toolbar = styled.div`
    position: sticky;
    top: 0;
    z-index: 3;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
    padding: 14px 16px 10px;
    background: linear-gradient(${({ theme }) => theme.screen} 75%, transparent);
`;

export const SearchBox = styled.label`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 14px;
    height: 46px;
    border-radius: 12px;
    background: ${({ theme }) => theme.screenAlt};
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.screenLine};
    transition: box-shadow .2s ease;

    &:focus-within {
        box-shadow: inset 0 0 0 2px ${({ theme }) => theme.lens}, 0 0 0 4px ${({ theme }) => theme.lens}22;
    }

    svg { flex: none; color: ${({ theme }) => theme.fontMuted}; }

    input {
        flex: 1;
        min-width: 0;
        height: 100%;
        background: none;
        border: none;
        outline: none;
        font-size: 1rem;
    }

    input::placeholder { color: ${({ theme }) => theme.fontMuted}; }
    input::-webkit-search-cancel-button { filter: grayscale(1); }

    .count {
        font-family: ${({ theme }) => theme.fontPixel};
        font-size: .8rem;
        color: ${({ theme }) => theme.fontMuted};
        white-space: nowrap;
    }
`;

export const Chips = styled.div`
    display: flex;
    gap: 6px;
    overflow-x: auto;
    scrollbar-width: none;
    padding: 2px 2px 4px;
    margin: 0 -2px;
    scroll-snap-type: x proximity;
    &::-webkit-scrollbar { display: none; }
`;

export const Chip = styled.button<{ $color: string; $active: boolean }>`
    flex: none;
    scroll-snap-align: start;
    font-size: .8rem;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 999px;
    color: ${({ $active, $color, theme }) => ($active ? readableTextColor($color) : theme.font)};
    background: ${({ $active, $color }) => ($active ? $color : "transparent")};
    box-shadow: inset 0 0 0 1.5px ${({ $color }) => $color};
    transition: background-color .2s ease, color .2s ease, transform .15s ease;

    &:active { transform: scale(.94); }
`;

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(156px, 1fr));
    gap: 14px;
    padding: 4px 16px 24px;

    @media (max-width: 420px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        padding: 4px 10px 20px;
    }
`;

export const Skeleton = styled.div`
    height: 220px;
    border-radius: 16px;
    background: linear-gradient(90deg, ${({ theme }) => theme.card} 0%, ${({ theme }) => theme.cardHover} 50%, ${({ theme }) => theme.card} 100%);
    background-size: 200% 100%;
    animation: ${shimmer} 1.3s linear infinite;
`;

export const Sentinel = styled.div`
    height: 1px;
`;

export const Status = styled.div`
    flex: 1;
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
    width: 46px;
    aspect-ratio: 1;
    border-radius: 50%;
    background:
        radial-gradient(circle, #fff 0 5px, #222 6px 9px, transparent 10px),
        linear-gradient(#e3102a 0 46%, #222 46% 54%, #f4f4f4 54%);
    box-shadow: 0 0 0 3px #222;
    animation: ${spin} 1s cubic-bezier(.5, .1, .5, .9) infinite;
`;
